var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Canvas = require('canvas');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = {

	_width:  0,
	_height: 0,

	clone: function (cb) {
		var TopoGrid = require('./../TopoGrid');
		TopoGrid({}, {source: this.data.slice(0), source_type: 'array', width: this._width, height: this._height}, cb);
	},

	digest_image: function (image) {
		if (_DEBUG) console.log('image size: %s, %s', image.width, image.height);
		var img_canvas = new Canvas(image.width, image.height);
		img_canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
		this.canvas_to_data(img_canvas);
	},

	digest_image_file: function (file, cb) {
		var self = this;
		fs.readFile(file, function (err, cityhouse) {
			if (err) throw err;

			var image = new Canvas.Image();
			image.src = cityhouse;
			self.digest_image(image);
			cb();
		});
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
	digest_canvas:         function (cb, canvas) {
		//	console.log('digesting canvas');
		if (canvas) {
			this.set_config('source', canvas);
		} else {
			canvas = this.get_config('source');
			this.canvas_to_data(canvas);
		}

		if (!canvas) {
			return cb(new Error('no source'));
		}

		cb();
	},

	canvas_to_data: function (canvas) {
		this._width = canvas.width;
		this._height = canvas.height;
		var image_data = canvas.getContext('2d').getImageData(0, 0, this._width, this._height).data;
		// console.log('image data: %s', util.inspect(image_data).substring(0, 100));

		this.data = _.reduce(image_data, function (out, value, i) {
			var target_index = Math.floor(i / 4);
			var channel = i % 4;

			if (channel == 0) {
				out[target_index] = [value];
			} else {
				out[target_index].push(value);
			}
			return out;

		}, []);

	},

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
	},

	filter: require('./filter'),

	draw: require('./draw'),

	scale: function (scalar, clone) {

	},

	combine: require('./combine')
}
; // end exports