var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

function _digest(cb) {
	var st = this.get_config('source_type');
	if (_DEBUG) console.log('source type: %s', st);
	switch (st) {
		case 'canvas':
			this.digest_canvas(this.get_config('source'));
			break;

		case 'image':
			this.digest_image(this.get_config('source'));
			break;

		case 'image_file':
			return this.digest_image_file(this.get_config('source'), cb);
			break;

		case 'array':
			this.data = this.get_config('source');
			if (this.get_config('width')){
				this._width = this.get_config('width');
			}
			if (this.get_config('height')){
				this._height = this.get_config('height');
			}
			break;

		default:

	}
	cb();
}
/* ********* EXPORTS ******** */

module.exports = {
	init_tasks:        [_digest],
	source:             null, // the source of the color data
	source_type:        'none', // the type of data the source is
	elevations:         _.range(0, 255 * 3), // an array that maps intensity to world units
	distance_per_pixel: 1, // the number of world units wide each pixel is
	intensities:        [], // the color matrix of the input
	heights:            [] // the translated heights of the matrix
} // end exports