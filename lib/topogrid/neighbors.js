var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (x, y, r, ring) {
	var self = this;
	//	console.log('neighbors: %s, %s, - %s', x, y, r);
	var value = this.value(x,y);

	var out = _.compact(_.flatten(_.map(_.range(y- r, y + r + 1), function (y_value) {
		return _.map(_.range(x - r, x + r + 1), function (x_value) {
			if (self.xy_good(x_value, y_value)) {

				var xy_value = self.value(x_value, y_value);

				if (_DEBUG) console.log('sampling %s, %s', x_value, y_value)
				return {x:         x_value, y: y_value,
					distance:      self.distance(x, y, x_value, y_value),
					orth_distance: self.orth_distance(x, y, x_value, y_value),
					x_offset:      x_value - x,
					y_offset:      y_value - y,
					value:         xy_value,
					rise:          xy_value - value
				}
			} else {
				if (_DEBUG) console.log('skipping %s, %s - bad', x_value, y_value)
				return false;
			}
		})
	})));

	if (ring) {
		if (_DEBUG) console.log('removing center of %s member ring', out.length);

		out = _.filter(out, function (data) {
			var abs_x_offset = Math.abs(data.x_offset);
			if (abs_x_offset == r){
				if (_DEBUG)  console.log('abs_x_offset %s == %s', abs_x_offset, r);
				return true;
			}

			var abs_y_offset = Math.abs(data.y_offset);
			if (abs_y_offset == r){
				if (_DEBUG)  console.log('abs_y_offset %s == %s', abs_y_offset, r);
				return true;
			}
			
			if (_DEBUG) console.log('rejecting %s, %s', data.x, data.y);
			return false;
		})
		if (_DEBUG) console.log('.. to %s members', out.length);
	}

	if (_DEBUG == 2){
		console.log('neighbor output: %s', util.inspect(out));
	}
	return out;
}