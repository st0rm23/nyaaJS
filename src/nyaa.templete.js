$nyaa.register(
	'templete',
	[],
	{
		onLoad: function(){
			if(typeof(jQuery) === 'undefined'){
				this.nyaa.error('nyaa.templete requires jQuery');
				return false;
			}
			this.nyaa.debug('templete onLoad');
		},
		use: function(name, data){
			var html = $('templetes > templete[name='+name+']').first().html();
			for(var key in data){
				var value = $('<a></a>').text(data[key]).html(); /*use jQuery to implement html_entity()*/
				value = value.replace(/\{\{/g, '&#123;&#123;'); /*prevent duplicate replace*/
				value = value.replace(/\}\}/g, '&#125;&#125;'); /*prevent duplicate replace*/
				var re = RegExp('\\{\\{\\s*' + key + '\\s*\\}\\}', 'g');
				html = html.replace(re, value);
			}
			return html;
		}
	}
);