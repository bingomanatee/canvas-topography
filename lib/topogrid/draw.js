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

module.exports = function (pngfile, cb, rgba_filter) {
	rgba_filter = _.bind(rgba_filter, this);
	var data = rgba_filter ? _.map(this.data, rgba_filter) : this.data;
	if (_.any(data, function (v) {
		return !_.isArray(v);
	})) {
		throw new Error('non-array data element found - cannot draw');
	}

	var image_data = _.map(_.flatten(data), Math.floor);

	var canvas = new Canvas(this._width, this._height);
	var ctx = canvas.getContext('2d');
	var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
	_.each(image_data, function (v, i) {
		id.data[i] = v;
	});
	ctx.putImageData(id, 0, 0);

	var out = fs.createWriteStream(pngfile)
		, stream = canvas.pngStream();

	stream.on('data', function (chunk) {
		out.write(chunk);
	});

	stream.on('end', cb);
} // end export function