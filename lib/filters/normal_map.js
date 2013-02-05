var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = true;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var i = 0;

/* ********* EXPORTS ******** */

function normal_map_gen(params) {

	var _params = _.extend({
		distance:    1,
		isGreyscale: false,
		gsMap:       _.range(0, 256)
	}, params || {});


	return function (value, x, y) {
		var north_south_distance = 0;
		var north_value, south_value;
		if(this.xy_good(x, y - 1)){
			north_south_distance += _params.distance;
			north_value = this.value(x, y - 1);
		} else {
			north_value = value;
		}
		
		if (this.xy_good(x, y + 1)){
			north_south_distance += _params.distance;
			south_value = this.value(x, y + 1);
		} else {
			south_value = value;
		}
		
		var ns_difference = south_value - north_value;
		
		var green = 255 * (ns_difference / north_south_distance) + 127;


		var east_west_distance = 0;
		var east_value, west_value;

		if (this.xy_good(x - 1, y)){
			east_value = this.value(x - 1, y);
			east_west_distance += _params.distance;
		} else {
			east_value = value;
		}
		if (this.xy_good(x + 1, y)){
			west_value = this.value(x + 1, y);
			east_west_distance += _params.distance;
		} else {
			west_value = value;
		}
		var ew_differnce = west_value - east_value;
		var red = -255 * (ew_differnce / east_west_distance) + 127;

		return [red, green, 255, 255]

	}

} // end export function

module.exports = normal_map_gen;