var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var Canvas = require('canvas');
var node_topo = require('./../index');
var fs = require('fs');
var _DEBUG = false;
var assert = require('assert');

/* *********************** TEST SCAFFOLDING ********************* */
var cityhouse_file = path.resolve(__dirname, '../test_source/cityhouse.png');

var twostripe_file = path.resolve(__dirname, '../test_source/twostripe.png');
var twostripe_values = [
	255, 255, 0, 255, 0,
	255, 255, 0, 255, 0,
	255, 255, 0, 255, 0,
	255, 255, 0, 255, 0,
	255, 255, 0, 255, 0
];
var cityhouse_values = [
	146, 146, 146, 146, 146,
	146, 146, 146, 146, 146,
	146, 146, 146, 146, 146,
	146, 146, 146, 255, 255,
	146, 146, 146, 255, 255
];
var g_w = (255 + 146) / 2.0;
var g_b = (146.0) / 2.0;
var w_w = 255;
var w_b = 255.0 / 2.0;

var blended_values = [
	g_w, g_w, g_b, g_w, g_b,
	g_w, g_w, g_b, g_w, g_b,
	g_w, g_w, g_b, g_w, g_b,
	g_w, g_w, g_b, w_w, w_b,
	g_w, g_w, g_b, w_w, w_b
];

var blended_values_real = [
	200.5, 200.5, 73, 200.5,  73,
	200.5, 200.5, 73, 200.5,  73,
	200.5, 200.5, 73, 200.5,  73,
	200.5, 200.5, 73, 255,   127.5,
	200.5, 200.5, 73, 255,   127.5
];

/* ************************* TESTS ****************************** */

if (true){
	tap.test('equality of blended/values', function(t){
		t.deepEqual(blended_values, blended_values_real, 'initial values');
		t.end();
	})
}

if (true) {
	tap.test('test blending of two files - no clone', function (t) {
		node_topo.image_file_topos([cityhouse_file, twostripe_file], function (err, topos) {
			var cityhouse = topos[0];
			var twostripe = topos[1];
			cityhouse.compress_to_greyscale();
			twostripe.compress_to_greyscale();
			var centerish = cityhouse.neighbors(2, 2, 2);
			var centerish_twostripe = twostripe.neighbors(2, 2, 2);
			t.deepEqual(_.pluck(centerish_twostripe, 'value'), twostripe_values, 'original values of twostripe');

			t.deepEqual(_.pluck(centerish, 'value'), cityhouse_values, 'original values of cityhouse');

			cityhouse.combine(function (err, blended_topo) {
				// part one: validating that cityhouse values have not been changed
				var cityhouse_after_combine = cityhouse.neighbors(2, 2, 2);
				var cityhouse_after_combine_values = _.pluck(cityhouse_after_combine, 'value');
				t.deepEqual(cityhouse_after_combine_values, blended_values, 'alter values of cityhouse');

				// part two_ validtaing that the twostripe values have not been changed
				var centerish_twostripe = twostripe.neighbors(2,2,2);
				var twostripe_values_after_conbine = _.pluck(centerish_twostripe, 'value');
				t.deepEqual(twostripe_values_after_conbine, twostripe_values, 'preserve twostripe values');

				// part three: test the actual output
				var centerish_blended_after_combine = blended_topo.neighbors(2, 2, 2);
				var centerish_blended_values_after_combine = _.pluck(centerish_blended_after_combine, 'value');
				if (_DEBUG) console.log('blended values: %s', centerish_blended_values_after_combine);
				t.deepEqual(centerish_blended_values_after_combine,
					blended_values, 'blended values');
				t.end();
			}, twostripe, function (a, b) {
				if (_DEBUG) console.log('blending %s and %s', a, b);
				return (a + b) / 2.0;
			});

		})

	}) // end tap.test 1 pixel neighbor scan
}


if (true) {
	tap.test('test blending of two files - clone', function (t) {
		node_topo.image_file_topos([cityhouse_file, twostripe_file], function (err, topos) {
			var cityhouse = topos[0];
			var twostripe = topos[1];
			cityhouse.compress_to_greyscale();
			twostripe.compress_to_greyscale();
			var centerish = cityhouse.neighbors(2, 2, 2);
			var centerish_twostripe = twostripe.neighbors(2, 2, 2);
			t.deepEqual(_.pluck(centerish_twostripe, 'value'), twostripe_values, 'original values of twostripe (clone)');

			t.deepEqual(_.pluck(centerish, 'value'), cityhouse_values, 'original values of cityhouse (clone)');

			cityhouse.combine(function (err, blended_topo) {
				// part one: validating that cityhouse values have not been changed
				var cityhouse_after_combine = cityhouse.neighbors(2, 2, 2);
				var cityhouse_after_combine_values = _.pluck(cityhouse_after_combine, 'value');
				t.deepEqual(cityhouse_after_combine_values, cityhouse_values, 'preserve original values of cityhouse (clone)');

				// part two_ validtaing that the twostripe values have not been changed
				var centerish_twostripe = twostripe.neighbors(2,2,2);
				var twostripe_values_after_conbine = _.pluck(centerish_twostripe, 'value');
				t.deepEqual(twostripe_values_after_conbine, twostripe_values, 'preserve twostripe values (clone)');

				// part three: test the actual output
				var centerish_blended_after_combine = blended_topo.neighbors(2, 2, 2);
				var centerish_blended_values_after_combine = _.pluck(centerish_blended_after_combine, 'value');
				if (_DEBUG) console.log('blended values: %s', centerish_blended_values_after_combine);
				t.deepEqual(centerish_blended_values_after_combine,
					blended_values, 'blended values (clone)');
				t.end();
			}, twostripe, function (a, b) {
				if (_DEBUG) console.log('blending %s and %s', a, b);
				return (a + b) / 2.0;
			}, true);

		})

	}) // end tap.test 1 pixel neighbor scan
}
