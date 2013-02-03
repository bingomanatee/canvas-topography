var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var Canvas = require('canvas');
var node_topo = require('./../index');
var fs = require('fs');
var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */
var cityhouse_file = path.resolve(__dirname, '../test_source/cityhouse.png');
var stripe_file = path.resolve(__dirname, '../test_source/twostripe.png');

/* ************************* TESTS ****************************** */

if (true) {
	tap.test('test 1 pixel neighbor scan', function (t) {
		fs.readFile(cityhouse_file, function (err, cityhouse) {
			if (err) throw err;

			var cityhouse_img = new Canvas.Image();
			cityhouse_img.src = cityhouse;

			node_topo.TopoGrid({}, {
					source_type: 'image',
					source:      cityhouse_img
				},
				function (err, city_topo) {
					city_topo.compress_to_greyscale();
					var neighbors = city_topo.neighbors(2, 2, 1)
					var values = _.pluck(neighbors, 'value');
					t.deepEqual(values, [
						146, 146, 146,
						146, 146, 146,
						146, 146, 255], 'values of 1 pixel scan');
					t.deepEqual(_.pluck(neighbors, 'x'), [
						1, 1, 1,
						2, 2, 2,
						3, 3, 3]), 'x of 1 pixel scan';
					t.deepEqual(_.pluck(neighbors, 'y'), [
						1, 2, 3,
						1, 2, 3,
						1, 2, 3], 'y of 1 pixel scan');
					t.end();
				});
		});
	}) // end tap.test 1 pixel neighbor scan
}

if (true) {
	tap.test('test 1 pixel neighbor scan, range', function (t) {

		node_topo.TopoGrid({}, {
				source_type: 'image_file',
				source:      cityhouse_file
			},
			function (err, city_topo) {
				city_topo.compress_to_greyscale();
				var neighbors = city_topo.neighbors(2, 2, 1, true);
				var values = _.pluck(neighbors, 'value');
				t.deepEqual(values, [
					146, 146, 146,
					146, 146,
					146, 146, 255], 'values of 1 pixel ring');
				t.deepEqual(_.pluck(neighbors, 'x'), [
					1, 1, 1,
					2, 2,
					3, 3, 3], 'x of 1 pixel scan');
				t.deepEqual(_.pluck(neighbors, 'y'), [
					1, 2, 3,
					1, 3,
					1, 2, 3], 'y of 1 pixel scan');
				t.end();
			});
	}) // end tap.test 1 pixel neighbor scan
}

if (true) {
	tap.test('test 1 pixel neighbor scan at ur corner', function (t) {

		node_topo.TopoGrid({}, {
				source_type: 'image_file',
				source:      cityhouse_file
			},
			function (err, city_topo) {
				city_topo.compress_to_greyscale();
				var neighbors = city_topo.neighbors(8, 8, 1)
				var values = _.pluck(neighbors, 'value');
				t.deepEqual(values, [
					146, 146,
					146, 146
				], 'values of 1 pixel scan at ur');
				t.deepEqual(_.pluck(neighbors, 'x'), [
					7, 7,
					8, 8
				], 'x of 1 pixel scan at ur');
				t.deepEqual(_.pluck(neighbors, 'y'), [
					7, 8,
					7, 8
				], 'y of 1 pixel scan at ur');
				t.end();

			}) // end tap.test 1 pixel neighbor scan
	})
}

if (true) {
	tap.test('test 1 pixel neighbor scan, range', function (t) {
		fs.readFile(cityhouse_file, function (err, cityhouse) {
			if (err) throw err;

			var cityhouse_img = new Canvas.Image();
			cityhouse_img.src = cityhouse;

			node_topo.TopoGrid({}, {
					source_type: 'image',
					source:      cityhouse_img
				},
				function (err, city_topo) {
					city_topo.compress_to_greyscale();
					var neighbors = city_topo.neighbors(2, 2, 1, true);
					var values = _.pluck(neighbors, 'value');
					t.deepEqual(values, [
						146, 146, 146,
						146, 146,
						146, 146, 255], 'values of 1 pixel ring');
					t.deepEqual(_.pluck(neighbors, 'x'), [
						1, 1, 1,
						2, 2,
						3, 3, 3], 'x of 1 pixel scan');
					t.deepEqual(_.pluck(neighbors, 'y'), [
						1, 2, 3,
						1, 3,
						1, 2, 3], 'y of 1 pixel scan');
					t.end();
				});
		});
	}) // end tap.test 1 pixel neighbor scan
}

if (true) {
	tap.test('test 2 pixel neighbor scan', function (t) {
		fs.readFile(cityhouse_file, function (err, cityhouse) {
			if (err) throw err;

			var cityhouse_img = new Canvas.Image();
			cityhouse_img.src = cityhouse;

			node_topo.TopoGrid({}, {
					source_type: 'image',
					source:      cityhouse_img
				},
				function (err, city_topo) {
					city_topo.compress_to_greyscale();
					var neighbors = city_topo.neighbors(2, 2, 2)
					var values = _.pluck(neighbors, 'value');
					t.deepEqual(values, [
						146, 146, 146, 146, 146,
						146, 146, 146, 146, 146,
						146, 146, 146, 146, 146,
						146, 146, 146, 255, 255,
						146, 146, 146, 255, 255], '2 pixel scan values');
					t.deepEqual(_.pluck(neighbors, 'x'), [
						0, 0, 0, 0, 0,
						1, 1, 1, 1, 1,
						2, 2, 2, 2, 2,
						3, 3, 3, 3, 3,
						4, 4, 4, 4, 4], '2 pixel scan x');
					t.deepEqual(_.pluck(neighbors, 'y'), [
						0, 1, 2, 3, 4,
						0, 1, 2, 3, 4,
						0, 1, 2, 3, 4,
						0, 1, 2, 3, 4,
						0, 1, 2, 3, 4], '2 pixel scan y');
					t.end();
				});
		});
	}) // end tap.test 1 pixel neighbor scan
}

if (true){
	tap.test('test 2 pixel neighbor scan, range', function (t) {
		fs.readFile(cityhouse_file, function (err, cityhouse) {
			if (err) throw err;

			var cityhouse_img = new Canvas.Image();
			cityhouse_img.src = cityhouse;

			node_topo.TopoGrid({}, {
					source_type: 'image',
					source:      cityhouse_img
				},
				function (err, city_topo) {
					city_topo.compress_to_greyscale();
					var neighbors = city_topo.neighbors(2, 2, 2, true);
					var values = _.pluck(neighbors, 'value');
					t.deepEqual(values,
						[
							146, 146, 146, 146, 146,
							146, 146,
							146, 146,
							146, 255,
							146, 146, 146, 255, 255], '2 pixel ring balues');
					t.deepEqual(_.pluck(neighbors, 'x'), [
						0, 0, 0, 0, 0,
						1, 1,
						2, 2,
						3, 3,
						4, 4, 4, 4, 4], '2 pixel san x');
					t.deepEqual(_.pluck(neighbors, 'y'), [
						0, 1, 2, 3, 4,
						0, 4,
						0, 4,
						0, 4,
						0, 1, 2, 3, 4], '2 pixel scan y');
					t.end();
				});
		});
	}) // end tap.test 1 pixel neighbor scan end tap.test 2
}
	 