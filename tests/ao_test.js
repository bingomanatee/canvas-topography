var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var Canvas = require('canvas');
var node_topo = require('./../index');
var fs = require('fs');

var _DEBUG = false;

/** *****************
 *
 * These tests aren't true "unit tests" -- they produce images
 * that require human inspection to validate -= but they are cool.
 */

/* *********************** TEST SCAFFOLDING ********************* */

var citygrid_file = path.resolve(__dirname,
	'../test_source/citygrid.png');
var citygrid_ao_file = path.resolve(__dirname,
	'../test_source/citygrid_ao.png');
var citygrid_shaded_file = path.resolve(__dirname,
	'../test_source/citygrid_shaded.png');
var cityhouse_file = path.resolve(__dirname,
	'../test_source/cityhouse.png');
var cityhouse_shaded_file = path.resolve(__dirname,
	'../test_source/cityhouse_ao.png');

var ao = node_topo.filters.ao({
	radius:      4,
	post_filter: function (light, value) {
		var color = Math.round(128 + light);
		return [color, color, color, 255];
	}});

var shade = node_topo.filters.shadow({ rise: 2.5, distance: 3, fade: 1.66});

/* ************************* TESTS ****************************** */

if (false) {
	tap.test('test_ao', function (t) {
		fs.readFile(cityhouse_file, function (err, citygrid) {
			if (err) throw err;

			var citygrid_img = new Canvas.Image();
			citygrid_img.src = citygrid;

			node_topo.TopoGrid({}, {
					source_type: 'image',
					source:      citygrid_img
				},
				function (err, city_topo) {
					city_topo.compress_to_greyscale();
					city_topo.filter(function (err, ao_shading) {
						if (_DEBUG) console.log('ao_shading data', util.inspect(ao_shading.data));
						city_topo.filter(function (err, blended) {
								blended.draw(cityhouse_shaded_file, function () {
									t.end();
								});
							},
							function (base_value, x, y) {
								var color = parseInt(base_value + ao_shading.value(x, y));
								return [color, color, color, 255];
							}
							, true);
					}, ao, true);
				});
		});
	}); // test_ao
}

if (false) {

	tap.test('test_ao_large', function (t) {
		fs.readFile(citygrid_file, function (err, citygrid) {
			if (err) throw err;

			var citygrid_img = new Canvas.Image();
			citygrid_img.src = citygrid;

			node_topo.TopoGrid({}, {
					source_type: 'image',
					source:      citygrid_img
				},
				function (err, city_topo) {
					city_topo.compress_to_greyscale();
					city_topo.filter(function (err, ao_shading) {
						if (_DEBUG) console.log('ao_shading data', util.inspect(ao_shading.data));
						city_topo.filter(function (err, blended) {
								blended.draw(citygrid_shaded_file, function () {
									t.end();
								});
							},
							function (base_value, x, y) {
								var color = parseInt(base_value + ao_shading.value(x, y));
								return [color, color, color, 255];
							}
							, true);
					}, ao, true);
				});
		});
	}); // test_ao
}

if (true) {

	tap.test('test_ao_and_shadow', function (t) {
		fs.readFile(citygrid_file, function (err, citygrid) {
			if (err) throw err;

			var citygrid_img = new Canvas.Image();
			citygrid_img.src = citygrid;

			node_topo.TopoGrid({}, {
					source_type: 'image',
					source:      citygrid_img
				},
				function (err, city_topo) {
					city_topo.compress_to_greyscale();
					city_topo.filter(function (err, ao_shading) {
						if (_DEBUG) console.log('ao_shading data', util.inspect(ao_shading.data));
						ao_shading.draw(citygrid_ao_file,
							function () {
								city_topo.filter(function (err, shaded) {
										shaded.draw(citygrid_shaded_file, function () {
											t.end();
										}, function (v) {
										//	console.log('color for shadow: %s', v);
											var color = Math.floor(v * 255);
											return [color, color, color, 255];
										})

									},
									shade, true);
							}, function (value) {
								var color = parseInt(128 + value);
								return [color, color, color, 255];
							}
						);

					}, ao, true);
				});
		});
	}); // test_ao
}
