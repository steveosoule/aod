var fs = require('fs');
var crypto = require('crypto');
var sass = require('node-sass');
var request = require('request');

var compile_sass_from_at_import = function(){
	var local_file = make_local_sass_file(file_urls);

	sass.render({
		file: local_file
	}, function(err, result) {
		if( err ) console.log(err); return;
		console.log(result);
	});
};

var compile_sass_from_download = function(file_urls){
	file_urls.forEach(function(file_url){
		request(file_url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("FOO:" + file_url + ' - ' + body); // Show the HTML for the Google homepage.
			}
		});
	});
};

var make_local_sass_file = function(file_urls){

	var hash = crypto.createHash('md5').update( file_urls.join(',') ).digest('hex');
	var local_file = './cache/' + hash + '.sass';
	var sass_content = '';

	file_urls.forEach(function(file_url) {
		file_url = file_url.split(/\.(scss|sass)/)[0];
		sass_content += "@import url('" + file_url + "');\n";
	});

	fs.writeFile(local_file, sass_content, function (err) {
		if (err) return console.log(err);
		console.log(local_file + ' > ' + sass_content);
	});

	return local_file;
};

module.exports = {
	compile_from_request: function(req){
		var file_urls = req.query.file_urls;

		if( !file_urls ){
			return '/* Error: Please pass `file_urls` to compile. */';
		}

		file_urls = (typeof file_urls === 'string') ? file_urls.split(',') : file_urls;

		if( !file_urls.length ){
			return '/* Error: Please provide a file in the `file_urls`. */';
		}

		// compile_sass_from_at_import(file_urls);
		compile_sass_from_download(file_urls);

		return '/* Compiled: ' + JSON.stringify(file_urls) + '*/';
	}
};