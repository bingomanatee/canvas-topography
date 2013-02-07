var _ = require('underscore');
var util = require('util');


var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

function _digest(cb) {
	this.digest(cb);
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