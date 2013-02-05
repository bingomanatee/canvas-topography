var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

var Vector3 = require("./vector3");
var Plane = require('./plane');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */
function ab_rise(a, b, d) {
	var tan = (a - b) / d;
	var angle = Math.atan(tan); //PI/2 > angle > -PI/2
	if (_DEBUG) console.log('angle of (%s .. %s)/%s = %s degrees', a, b, d, angle * 180 / Math.PI);
	var float_angle = angle * 2 / Math.PI; // 1 > float_angle > -1
	if (_DEBUG) console.log('angle of (%s .. %s)/%s = %s in 1 .. -1', a, b, d, float_angle);
	return float_angle
}

function magnitude(x, y) {
	return Math.sqrt(x * x + y * y);
}

function cross_vector(m, n, s, e, w, d) {
	var s_point, e_point
	if (_.isNull(n)) {  // n is not a value
		if (_.isNull(s)) { // s is not a value
			throw new Error('no value for n or s')
		} else { // n is not a value, s is a value,
			s_point = new Vector3(0, d, s - m);
		}
	} else { // n is a value
		if (_.isNull(s)) { // n is a value, s is not a value
			s_point = new Vector3(0, d, m - n);
		} else { // n and s are values
			s_point = new Vector3(0, 2 * d, s - n);
		}
	}

	if (_.isNull(w)) {
		if (_.isNull(e)) {
			throw new Error('no value for e or w');
		} else { // w is null, e is not null
			e_point = new Vector3(d, 0, m - e);
		}
	} else { // w is not null
		if (_.isNull(e)) { // w is not null, e is null
			e_point = new Vector3(d, 0, w - m)
		} else { // w is not null, e is not null
			e_point = new Vector3(d * 2, 0, w - e);
		}
	}

	var p = new Plane().setFromCoplanarPoints(s_point, new Vector3(0,0,0), e_point);
	return p.normal;
}

cross_vector.ab_rise = ab_rise;
cross_vector.magnitude = magnitude;

/* ********* EXPORTS ******** */

module.exports = cross_vector; // end export function