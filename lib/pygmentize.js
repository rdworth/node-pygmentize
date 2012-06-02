/*
 * pygmentize
 * https://github.com/rdworth/node-pygmentize
 *
 * Copyright (c) 2012 Richard D. Worth
 * Licensed under the MIT license.
 */

var jsdom = require( "jsdom" ),
	async = require( "async" ),
	spawn = require( "child_process" ).spawn;

function file( filename, callback ) {
	if (filename === undefined ) {
		throw new Error("pygmentize.file() requires a filename argument");
	}

	jsdom.env({
		html: filename,
		features: {
			QuerySelector: true
		},
		done: function(errors, window) {
			var document = window.document,
				highlight = document.querySelectorAll(".highlight");

			async.forEachSeries( highlight, function( el, done ){
				var before = el.innerHTML,
					lang = el.getAttribute( "lang" ),
					after = "";

				var pygmentize = spawn( "pygmentize", [ "-l", lang, "-f", "html", "-O", "linenos=true" ]);
				pygmentize.stdout.on('data', function (data) {
					after += data;
				});
				pygmentize.stderr.on('data', function (data) {
					console.error('stderr: ' + data);
				});
				pygmentize.on('exit', function (code) {
					if ( code !== 0 ) {
						console.error('child process exited with code ' + code);
					}
					el.innerHTML = after;
					done();
				});
				pygmentize.stdin.write( before );
				pygmentize.stdin.end();
			}, function( error ){
				callback( error, window.document.body.innerHTML );
			});
		}
	});

}

module.exports = {
	file: file
};
