/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';


var less = require('less');
var root = fis.project.getProjectPath();

module.exports = function(content, file, conf) {
	conf.paths = [file.dirname, root];
	conf.syncImport = true;


	/* 参考 
		https://github.com/gruntjs/grunt-contrib-less/blob/master/README.md
		
		Source Map Revision 3 proposal
		https://docs.google.com/a/google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#

		Working with CSS Preprocessors
		https://developer.chrome.com/devtools/docs/css-preprocessors
	*/
	conf.filename = '/source' + file.subpath; // *.map {sources: '此处用到'}
	conf.sourceMap = true;
	conf.sourceMapFilename = file.filename + '.map';
	conf.sourceMapURL = file.filename + '.map';
	conf.writeSourceMap = function(sourceMapContent) {
		var fs = require('fs');
		fs.writeFileSync(file.dirname + '/' + file.filename + '.map', sourceMapContent, null);
	};


	var parser = new(less.Parser)(conf);
	parser.parse(content, function(err, tree) {
		if (err) {
			throw err;
		} else {
			if (parser.imports) {
				fis.util.map(parser.imports.files, function(path) {
					file.cache.addDeps(path);
				});
			}
			content = tree.toCSS(conf);
		}
	});
	return content;
};
