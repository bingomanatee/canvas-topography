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

module.exports = {

	xy: function (x, y) {
		if (_.isArray(x)) {
			y = x[1];
			x = x[0];
		}
		x = parseInt(x);
		y = parseInt(y);

		if (!this.xy_good(x, y)) throw new Error('bad XY ' + x + ',' + y);
		var w = this._width;
		return y * w + x;
	},

	deindex: function (index) {
		var y = Math.floor(index / this._width);
		var x = index % this._width;
		return [x, y]
	},

	xy_good: function (x, y) {
		return ((x >= 0) && (y >= 0) && (x < this._width) && (y < this._height));
	},

	value: function (x, y) {
		if (_.isArray(x)) {
			y = x[1];
			x = x[0];
		}
		var index = this.xy(x, y);
		if (_DEBUG) console.log('x/y: %s, %s, index: %s', x, y, index);
		return this.data[index];
	}

} // end exports