var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */
var combines = 0;

/* ********* EXPORTS ******** */

module.exports = function (cb, other_topo, combiner_filter, clone) {
	if (!_.isFunction(combiner_filter)){
		throw new Error(util.format(
			'bad combiner_filter: %s', util.inspect(combiner_filter)));
	}
	var c = ++combines;
	if (_DEBUG) console.log('starting combine %s: %s (%s)', c, combiner_filter.toString(), clone ? "clone" : 'alter');

	function done(){
		if (_DEBUG) console.log('done with combine %s', c);
		cb(null, this);
	}
	done = _.bind(done, this);
	if (clone){
		this.clone(function(err, new_this){
			new_this.combine(function(){
				cb(null, new_this);
			}, other_topo, combiner_filter);
		})
	} else {
		combiner_filter = _.bind(combiner_filter, this);
		var new_data = _.map(this.data, function(value, index){

			var combiner_value = other_topo.data[index];
			var xy = this.deindex(index);

			return combiner_filter(value, combiner_value, xy[0], xy[1]);

		}, this);
		if (_DEBUG) console.log('new data: %s', util.inspect(new_data));
		this.data = new_data;
		done();
	}
}; // end export function