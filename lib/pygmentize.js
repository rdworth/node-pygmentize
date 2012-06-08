/*
 * pygmentize
 * https://github.com/rdworth/node-pygmentize
 *
 * Copyright (c) 2012 Richard D. Worth
 * Licensed under the MIT license.
 */

var jsdom = require( "jsdom" ),
	async = require( "async" ),
	spawn = require( "child_process" ).spawn,
	which = require( "which" );

function file( filename, callback ) {
	if (filename === undefined ) {
		throw new Error("pygmentize.file() requires a filename argument");
	}

	try {
		which.sync( "pygmentize" );
	} catch ( error ) {
		throw new Error("The command `pygmentize` was not found. Ensure that\n" +
			"Pygments ( http://pygments.org/ ) is installed and pygmentize\n" +
			"is in the system path.\n");
	}

	jsdom.env({
		html: filename,
		features: {
			QuerySelector: true
		},
		done: function(errors, window) {
			var document = window.document,
				highlight = document.querySelectorAll("pre > code"),
				htmlDecode = function( input ) {
					var e = document.createElement( "div" );
					e.innerHTML = input;
					return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
				};

			async.forEachSeries( highlight, function( el, done ){
				var before = htmlDecode( el.innerHTML ),
					lang = el.getAttribute( "data-lang" ),
					linenum = el.getAttribute( "data-linenum" ) || undefined,
					after = "",
					options = [];
				
				if ( !!lang ) {
					options.push( "-l", lang );
				} else {
					options.push( "-g" );
				}
				options.push( "-f", "html", "-O", "encoding=utf-8" +
					( linenum !== undefined ? ",linenos=true" : "" ) +
					( linenum > -1 ? ",linenostart=" + linenum : "" )
				);

				var pygmentize = spawn( "pygmentize", options);
				pygmentize.stdout.on('data', function (data) {
					after += data;
				});
				pygmentize.stderr.on('data', function (data) {
					console.error('stderr: ' + data);
				});
				pygmentize.on('exit', function (code) {
					if ( code !== 0 ) {
						console.error('child process exited with code ' + code);
						done( new Error( code ) );
						return;
					}
					var div = document.createElement( "div" );
					div.innerHTML = "<div class=\"highlightblock\">" + after + "</div>";
					el.parentNode.parentNode.replaceChild( div.childNodes[ 0 ], el.parentNode );
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
