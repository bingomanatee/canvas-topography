var _ = require('underscore');
var util = require('util');


var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (params) {

	_.defaults(params, {distance: 1, rise: 1.5,  fade: 1.25, post_filter: false});
if (_DEBUG)	console.log('params: %s', util.inspect(params));

	return function (value, x, y) {
		var pix_distance = 0;
		var shade = 0;
		while (x && y) {
			 --x; --y;
			++pix_distance;
			var rise = this.value(x, y) - value;
			if (rise > 0){
				var run = (pix_distance * params.distance);
				var overhang = (rise - run);
				var denom = params.distance * Math.pow(2, pix_distance * params.fade);
				var new_shade = overhang/denom;

			 if (_DEBUG )	console.log('rise: %s, run: %s, overhang: %s, denom: %s, pix_distance: %s, new_shace: %s',
					rise, run, overhang,
					denom.toFixed(2), pix_distance, new_shade.toFixed(3));
				shade = Math.max(shade, new_shade);

			}
		}
		return Math.max(0, 1 - shade);
	}
} // end export function