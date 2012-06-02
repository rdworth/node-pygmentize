# node-pygmentize

Syntax highlighting with pygmentize.

Requires the pygmentize command line tool from [Pygments](http://pygments.org/).

Use this if you have an html file with various blocks of code you want syntax highlighted.

If you're looking for a more generic wrapper around Pygments, see https://github.com/pksunkara/pygments.js

## Limitations

Currently only works on html snippet files that only contain the contents of a body.

## Getting Started
Install the module with: `npm install pygmentize`

```javascript
var pygmentize = require( "pygmentize" );
pygmentize.file( filename, callback( err, data ) );
```

## License
Copyright (c) 2012 Richard D. Worth	
Licensed under the MIT license.
