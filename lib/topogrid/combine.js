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

module.exports = function (cb, other_topo, combiner_filter, clone) {

	if (clone){
		this.clone(function(err, new_this){
			new_this.combine(cb, other_topo, combiner_filter);
		})
	} else {
		combiner_filter = _.bind(combiner_filter, this);
		var new_data = _.map(this.data, function(value, index){

			var combiner_value = other_topo.data[index];
			var xy = this.deindex(index);

			return combiner_filter(value, combiner_value, xy[0], xy[1]);

		}, this);
		this.data = new_data;
	}
} // end export function