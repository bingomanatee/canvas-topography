var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = {

	digest: function (cb) {
		var st = this.get_config('source_type');
		var src = this.get_config('source');

		if ((src && st ) && this['digest_' + st]) {
			this['digest_' + st](src, cb)
		}
	},

	digest_array: function (array, cb) {

		this.data = this.get_config('source');
		if (this.get_config('width')) {
			this._width = this.get_config('width');
		}
		if (this.get_config('height')) {
			this._height = this.get_config('height');
		}
		cb();
	},

	digest_function: function (fn, cb) {
		this._width = this.get_config('width');
		this._height = this.get_config('height');
		var array_size = this._width * this._height;
		var fnb = _.bind(fn, this);
		this.data = _.map(_.range(0, array_size),
			function (index) {
				var xy = this.deindex(index);
				return fnb(xy[0], xy[1]);
			}, this);

		cb();
	}
}; // end exports