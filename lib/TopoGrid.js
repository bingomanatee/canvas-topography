var _ = require('underscore');
var util = require('util');
var Component = require('hive-component');
var _DEBUG = false;
var _mixins = require('./topogrid/mixins');
var _config = require('./topogrid/config');

/* ************************************
 * TopoGrid is a utility that translates an image to a matrix of heights
 * based on its intensity.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (mixins, config, cb) {

	if (_DEBUG) console.log('config: %s', util.inspect(config));
	var grid = Component([_mixins, mixins], [ config,_config]);
	 grid.init(cb);

}; // end export function