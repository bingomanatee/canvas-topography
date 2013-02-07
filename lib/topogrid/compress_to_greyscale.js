var _ = require('underscore');
var util = require('util');


var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (method) {
	var _compressor;
	if (_.isFunction(method)) {
		_compressor = method;
	} else if (_.isArray(method)) {
		_compressor = function (value) {
			if (value <= 0) {
				value = 0;
			} else if (value >= method.length) {
				value = method.length - 1;
			} else {
				value = Math.floor(method);
			}
			return method[value];
		}
	} else {
		switch (method) {
			case 'r':
				_compressor = function (value) {
					return value[0];
				}
				break;
			case 'g':
				_compressor = function (value) {
					return value[1];
				}
				break;
			case 'b':
				_compressor = function (value) {
					return value[2];
				}
				break;
			case 'a':
				_compressor = function (value) {
					return value[3];
				}
				break;

			case 'avg':

			default:
				_compressor = function (value) {
					return (value[0] + value[1] + value[2]) / 3;
				}
		}
	}
	if (_DEBUG) console.log('values in: %s', util.inspect(this.data));
	this.data = _.map(this.data, _compressor);
	if (_DEBUG) console.log('values out: %s', util.inspect(this.data));
}