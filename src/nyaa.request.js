$nyaa.register(
	'request',
	[],
	{
		onLoad: function(){
			if(typeof(jQuery) === 'undefined'){
				this.nyaa.error('nyaa.request requires jQuery');
				return false;
			}
			this.nyaa.debug('request onLoad');
			$nyaa.ready(function(){
				window.onhashchange = function(){
					$nyaa.request._hash = false;
					$nyaa.event('HashChange');
				}
				window.onhashchange();
			});
		},
		_query: false,
		query: function(key){
			if(this._query === false){
				this._query = {};
				var re = /(?:([^&=\?]+?)(?:=([^&=\?]*?))?)(?:&|$)/ig;
				var result;
				while(result = re.exec(location.search)){
					this._query[result[1]] = result[2] === undefined?'':result[2];
				}
			}
			return this._query[key] === undefined?null:this._query[key];
		},
		_hash: false,
		hash: function(key){
			if(this._hash === false){
				this._hash = {};
				var re = /(?:([^&=#]+?)(?:=([^&=#]*?))?)(?:&|$)/ig;
				var result;
				while(result = re.exec(location.hash)){
					this._hash[result[1]] = result[2] === undefined?'':result[2];
				}
			}
			return this._hash[key] === undefined?null:this._hash[key];
		}
	}
);