$nyaa.register(
	'ajax',
	[],
	{
		onLoad: function(){
			if(typeof(jQuery) === 'undefined'){
				this.nyaa.error('nyaa.ajax requires jQuery');
				return false;
			}
			this.nyaa.debug('ajax onLoad');
		},
		_ajax: function(method, url, data, success, error){
			$.ajax({
				crossDomain: true,
				cache: false,
				xhrFields: {
					withCredentials: true
				},
				type: method,
				url: url,
				data: data,
				success: success,
				error: error,
				dataType: 'json'
			});
		},
		get: function(url, data, success, error){
			if(typeof(data) === 'undefined') data = {};
			if(typeof(data) === 'function'){
				error = success;
				success = data;
				data = {};
			}
			data[$('meta[name=csrf-param]').attr('content')] = $('meta[name=csrf-token]').attr('content');
			this._ajax('POST', url, data, success, error);
		},
		post: function(url, data, success, error){
			if(typeof(data) === 'undefined') data = {};
			if(typeof(data) === 'function'){
				error = success;
				success = data;
				data = {};
			}
			data[$('meta[name=csrf-param]').attr('content')] = $('meta[name=csrf-token]').attr('content');
			var query = '';
			for(var key in data){
				if(query !== '') query += '&';
				query += encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
			}
			if(query !== '') url += '?' + query;
			this._ajax('GET', url, {}, success, error);
		}
	}
);