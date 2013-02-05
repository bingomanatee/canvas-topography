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



	digest: function (cb) {
		var st = this.get_config('source_type');
		if (_DEBUG) console.log('source type: %s', st);
		switch (st) {
			case 'canvas':
				this.digest_canvas(this.get_config('source'));
				break;

			case 'image':
				this.digest_image(this.get_config('source'));
				break;

			case 'function':
				return this.digest_function(this.get_config('source'), cb);
				break;

			case 'image_file':
				return this.digest_image_file(this.get_config('source'), cb);
				break;

			case 'array':
				this.data = this.get_config('source');
				if (this.get_config('width')) {
					this._width = this.get_config('width');
				}
				if (this.get_config('height')) {
					this._height = this.get_config('height');
				}
				break;

			default:

		}
		cb();
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

	}

}; // end exports