function getCurrentScript(){
	var src = '';
	if(typeof(document.currentScript) === 'undefined'){
		/*document.currentScript is not supported by IE and other older browsers*/
		var scripts = document.getElementsByTagName('script');
		src = scripts[scripts.length - 1].src;
	}else{
		src = document.currentScript.src;
	}
	return src.substr(0, src.lastIndexOf('/'));
}

Module = function(module, depend, obj){
	this.module = module;
	this.loaded = false;
	this._load_lock = false;
	this.depend = depend;
	this.nyaa = $nyaa;
	this.extend(obj);
	
	this.nyaa.debug('Module object "'+module+'" is created');
}

Module.prototype.extend = function(source){
	for(var index in source){
		this[index] = source[index];
	}
	return this;
}

Module.prototype.load = function(){
	if(this._load_lock || this.loaded) return;
	this._load_lock = true;
	
	var flag = true;
	for(var i = 0; i < this.depend.length; ++i){
		if(this.nyaa._loaded_module_list.indexOf(this.depend[i]) === -1){
			flag = false;
			break;
		}
	}
	if(flag){
		this.nyaa._loaded_module_list.push(this.module);
		this.loaded = true;
		this.onLoad();
	}
	this._load_lock = false;
};

$nyaa = {
	version: '0.2.0',
	platform: 'development',
	_system_modules: ['ajax'],
	base: {
		system: getCurrentScript(),
		custom: getCurrentScript(),
	},

	_msg: function(msg, handler){
		return '[nyaaJS-' + this.version + '] ' + handler + ': ' + msg;
	},
	error: function(msg){
		console.error(this._msg(msg, 'error'));
	},
	warning: function(msg){
		console.warn(this._msg(msg, 'warning'));
	},
	info: function(msg){
		console.info(this._msg(msg, 'info'));
	},
	log: function(msg){
		console.log(this._msg(msg, 'log'));
	},
	debug: function(msg){
		if(this.platform === 'development')
			console.debug(this._msg(msg, 'debug'));
	},
	
	register: function(module, depend, interface){
		if(this._registered_module_list.indexOf(module) !== -1)
			return;
		
		this._registered_module_list.push(module);
		this.debug('register "' + module + '"');
		var oModule = new Module(module, depend, interface);
		this[module] = oModule;
		var flag = true;
		for(var i = 0; i < depend.length; ++i){
			this._use(depend[i]);
		}
		oModule.load();
		var last_loaded_module_count;
		do{
			last_loaded_module_count = this._loaded_module_list.length;
			for(var i = 0; i < this._registered_module_list.length; ++i){
				this[this._registered_module_list[i]].load();
			}
		}while(last_loaded_module_count != this._loaded_module_list.length);
	},
	_module_to_uri: function(module){
		if(this._system_modules.indexOf(module) !== -1)
			return this.base.system + '/modules/nyaaJS.module.' + module + '.js'
		return this.base.custom + '/' + module + '.js';
	},
	_use: function(module){
		if(this._fetched_module_list.indexOf(module) !== -1)
			return;
		this._fetched_module_list.push(module);
		var oScript = document.createElement('script');
		var oHead = document.getElementsByTagName('head').item(0);
		oScript.type = "application/javascript"; 
		oScript.src = this._module_to_uri(module);
		oHead.appendChild(oScript);
	},
	
	init: function(config){		
		if(typeof(this._init_was_called) !== 'undefined' && this._init_was_called === true){
			this.warning('duplicated call to $nyaa.init()');
			return false;
		}
		this._init_was_called = true;
		
		this._fetched_module_list = [];
		this._registered_module_list = [];
		this._loaded_module_list = [];
		if(typeof(this.config) === 'undefined'){
			this.error('please set $nyaa.config before call to $nyaa.init()');
			return false;
		}
		if(typeof(this.config) !== 'object'){
			this.error('$nyaa.config should be a object');
			return false;
		}
		if(typeof(this.config.base) === 'undefined'){
			this.warning('$nyaa.config.base not defined, useing "' + this.base.custom + '" instead');
		}else if(typeof(this.config.base) !== 'string'){
			this.error('$nyaa.config.base should be a string');
			return false;
		}else{
			this.base.custom = this.config.base;
			if(this.base.custom.lastIndexOf('/') === this.base.custom.length + 1){
				this.base.custom = this.base.custom.substr(0, this.base.custom.length - 1);
			}
		}
		if(typeof(this.config.modules) === 'undefined'){
			this.warning('$nyaa.config.modules not defined');
			this.debug('$nyaa.config.modules not defined, set to blank array');
			this.config.modules = [];
		}
		if(typeof(this.config.modules) === 'string'){
			this.warning('$nyaa.config.modules is a string');
			this.debug('transform to array object with one item');
			this.config.modules = [this.config.modules];
		}
		for(var i = 0; i < this.config.modules.length; ++i){
			var module = this.config.modules[i];
			this._use(module);
		}
	}
};