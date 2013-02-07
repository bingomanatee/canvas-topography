var _ = require('underscore');
var util = require('util');


var _DEBUG = false;
var Vector3 = require('./../util/vector3');
var cross_vector = require('./../util/cross_vector');

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
		light_x: -0.2,
		light_y: -0.2,
		light_z: 1,
		max_light: 2,
		light_scale: 255,
		gsMap:       _.range(0, 256)
	}, params || {});

	var light_normal = new Vector3(_params.light_x, _params.light_y, _params.light_z);

	return function (value, x, y) {
		try {

		var north_value = null, south_value = null;
		if(this.xy_good(x, y - 1)){
			north_value = this.value(x, y - 1);
		}

		if (this.xy_good(x, y + 1)){
			south_value = this.value(x, y + 1);
		}

		var east_value = null, west_value = null;

		if (this.xy_good(x - 1, y)){
			east_value = this.value(x - 1, y);
		} else {
			east_value = value;
		}
		if (this.xy_good(x + 1, y)){
			west_value = this.value(x + 1, y);
		} else {
			west_value = value;
		}

		var slope_normal = cross_vector(value, north_value, south_value, east_value, west_value, _params.distance);

		var angle = slope_normal.angleTo(light_normal); // angle ranges from 0 ... PI/2; realistically, in the 0.. PI/4 range

		if (_DEBUG) console.log('(%s, %s) slope: %s, angle: %s', x, y, util.inspect(slope_normal), angle)
		var lightness = Math.floor((Math.PI/2 - angle) * 255);

		return [lightness, lightness, lightness, 255];
		} catch(err){
			console.log('error: %s', util.inspect(err));
		}

	}

} // end export function

module.exports = normal_map_gen;