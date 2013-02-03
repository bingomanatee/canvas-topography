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

module.exports = function (params) {

	_.defaults(params, {max_effect: 0.5, shine: 0.25, radius: 2});
	if (_DEBUG)    console.log('params: %s', util.inspect(params));

	return function (value, x, y) {
		var self = this;
		var net_offset = 0;

		_.each(_.range(1, params.radius), function (radius) {
			var ring = self.neighbors(x, y, radius);

			_.each(ring, function (data) {
				if (data.value > value){
					data.value -= value;
				} else {
					data.value = 0;
				}
				data.influence = 1 / (Math.pow(2, data.distance));
			});

			var weight = _.reduce(ring, function (out, data) {
				return out + data.influence;
			}, 0);

			if (_DEBUG) console.log('neighbor ring (%s, %s): %s',
				x, y, util.inspect(_.pluck(ring, 'value')));

			var offset = _.reduce(ring, function (out, data) {

				return out + data.value * data.influence;
			}, 0);

			net_offset -= offset/weight;

		});

		if (net_offset && _DEBUG){
			console.log('net offset at %s,%s(%s): %s', x, y, value, net_offset);
		}
		if (net_offset > 0) net_offset *= params.shine;
		return net_offset;
	};

} // end export function