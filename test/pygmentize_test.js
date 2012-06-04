var pygmentize = require( "../lib/pygmentize.js" );

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

exports[ "file" ] = {
	setUp: function( done ) {
		// setup here
		done();
	},
	"no args": function( test ) {
		test.expect( 1 );
		test.throws(function() { pygmentize.file(); }, 'filename argument is required.' );
		test.done();
	},
	"default": function( test ) {
		test.expect( 1 );
		pygmentize.file( '' +
			'<pre><code></code></pre>',
			function( err, data ) {
				test.equal( data, '' +
					'<div class="highlightblock">' +
						'<div class=\"highlight\">' +
							'<pre>\n' +
							'</pre>' +
						'</div>\n' +
					'</div>' );
				test.done();
			});
	},
	"data-linenum": function( test ) {
		test.expect( 1 );
		pygmentize.file( '' +
			'<pre><code data-linenum>var\n' +
			'var\n' +
			'</code></pre>',
			function( err, data ) {
				test.equal( data, '' +
					'<div class="highlightblock">' +
						'<table class="highlighttable">' +
							'<tr>' +
								'<td class="linenos">' +
									'<div class="linenodiv">' +
										'<pre>1\n' +
										'2</pre>' +
									'</div>' +
								'</td>' +
								'<td class="code">' +
									'<div class="highlight">' +
										'<pre><span class="n">var</span>\n' +
										'<span class="n">var</span>\n' +
										'</pre>' +
									'</div>\n' +
								'</td>' +
							'</tr>' +
						'</table>' +
					'</div>' );
				test.done();
			});
	},
	"data-linenum=true": function( test ) {
		test.expect( 1 );
		pygmentize.file( '' +
			'<pre><code data-linenum="true">var\n' +
			'var\n' +
			'</code></pre>',
			function( err, data ) {
				test.equal( data, '' +
					'<div class="highlightblock">' +
						'<table class="highlighttable">' +
							'<tr>' +
								'<td class="linenos">' +
									'<div class="linenodiv">' +
										'<pre>1\n' +
										'2</pre>' +
									'</div>' +
								'</td>' +
								'<td class="code">' +
									'<div class="highlight">' +
										'<pre><span class="n">var</span>\n' +
										'<span class="n">var</span>\n' +
										'</pre>' +
									'</div>\n' +
								'</td>' +
							'</tr>' +
						'</table>' +
					'</div>' );
				test.done();
			});
	},
	"data-linenum=15": function( test ) {
		test.expect( 1 );
		pygmentize.file( "<pre><code data-linenum=15>var\nvar\n</code></pre>", function( err, data ) {
			test.equal( data, '' +
				'<div class="highlightblock">' +
					'<table class="highlighttable">' +
						'<tr>' +
							'<td class="linenos">' +
								'<div class="linenodiv">' +
									'<pre>15\n' +
									'16</pre>' +
								'</div>' +
							'</td>' +
							'<td class="code">' +
								'<div class="highlight">' +
									'<pre><span class="n">var</span>\n' +
									'<span class="n">var</span>\n' +
									'</pre>' +
								'</div>\n' +
							'</td>' +
						'</tr>' +
					'</table>' +
				'</div>' );
			test.done();
		});
	}
};
