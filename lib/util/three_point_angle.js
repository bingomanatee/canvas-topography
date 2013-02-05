var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

function _distance(a, b){
	var xd = a[0] - b[0];
	var yd = a[1] - b[1];
	var zd = a[2] - b[2];

	return Math.sqrt(xd * xd + yd * yd + zd * zd);
}

function three_point_angle(a, b, c) {

	var result = 0.0;

// calculating the 3 distances

	var ab = _distance(a, b);

	var bc = _distance(b, c);

	var ac = _distance(a, c);

	var cosB = Math.pow(ac, 2) - Math.pow(ab, 2) - Math.pow(bc, 2);

	cosB /= (2 * ab * bc);

	result = (Math.acos(cosB) * 180 / Math.PI);

	return result;

}
/* ********* EXPORTS ******** */

module.exports = three_point_angle;