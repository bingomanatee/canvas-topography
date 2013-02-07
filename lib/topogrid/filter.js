var _ = require('underscore');
var util = require('util');


var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (cb, r_function, clone) {
	var data;
	if (_.isArray(r_function)) {
		data = _.map(this.data, function (value) {
			if (value > r_function.length) return null;
			return r_function[value];
		}, this);
	} else {
		r_function = _.bind(r_function, this);
		data = _.map(this.data, function (value, index) {
			//		console.log('mapping %s, %s,', value, index);
			var xy = this.deindex(index);
			return r_function(value, xy[0], xy[1]);
		}, this);
		//	console.log('cloned data: %s', util.inspect(data));
	}

	if (clone) {
		this.clone(function (err, topo) {
			topo.data = data;
			cb(null, topo);
		})
	} else {
		this.data = data;
		cb(null, this);
	}

}