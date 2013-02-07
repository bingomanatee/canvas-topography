var _ = require('underscore');
var util = require('util');


var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

var mixin = {

	_width:  0,
	_height: 0,

	clone: function (cb) {
		var TopoGrid = require('./../TopoGrid');
		TopoGrid({}, {source: this.data.slice(0), source_type: 'array', width: this._width, height: this._height}, cb);
	},

	orth_distance: function (x, y, x2, y2) {
		return Math.abs(x - x2) + Math.abs(y - y2);
	},

	distance: function (x, y, x2, y2) {
		var xd = x - x2, yd = y - y2;
		return Math.sqrt(xd * xd + yd * yd);
	},

	neighbors: require('./neighbors'),

	neighbor_values: function (x, y, r, asInt) {
		var out = this.neighbors(x, y, r);
		out = _.pluck(out, 'value');
		return asInt ? _.map(out, Math.round) : out;
	},

	compress_to_greyscale: require('./compress_to_greyscale'),

	filter: require('./filter'),

	combine: require('./combine')

}; // end exports

_.extend(mixin, require('./xy_mixins'));

_.extend(mixin, require('./digest_mixins'));

module.exports = mixin;