var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var Canvas = require('canvas');
var node_topo = require('./../index');
var fs = require('fs');

var _DEBUG = false;
var _STATE = true || _DEBUG;

/** *****************
 *
 * These tests aren't true "unit tests" -- they produce images
 * that require human inspection to validate -= but they are cool.
 */

/* *********************** TEST SCAFFOLDING ********************* */

function _path(file){
	return path.resolve(__dirname, '../test_source/', file);
}

var ao_filter = node_topo.filters.ao({
	radius:      4,
	post_filter: function (light, value) {
		var color = Math.round(128 + light);
		return [color, color, color, 255];
	}});

var shade_filter = node_topo.filters.shadow({ rise: 2.5, distance: 3, fade: 1.66});

function _float_to_color(v) {
	//	console.log('color for shadow: %s', v);
	var color = Math.floor(v * 255);
	return [color, color, color, 255];
}

function _d_grayscale_to_color(v){
	var color = Math.floor(128 + v);
	return [color, color, color, 255];
}

function _grayscale_to_color(v) {
	//	console.log('color for shadow: %s', v);
	var color = Math.floor(v);
	return [color, color, color, 255];
}

/* ************************* TESTS ****************************** */

if (false) {
	tap.test('test_ao', function (t) {
		fs.readFile(_path('cityhouse.png'), function (err, citygrid) {
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
					}, ao_filter, true);
				});
		});
	}); // test_ao
}

if (false) {

	tap.test('test_ao_large', function (t) {
		fs.readFile(_path('citygrid.png'), function (err, citygrid) {
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
								blended.draw(_path('cityhouse_ao.png'), function () {
									t.end();
								});
							},
							function (base_value, x, y) {
								var color = parseInt(base_value + ao_shading.value(x, y));
								return [color, color, color, 255];
							}
							, true);
					}, ao_filter, true);
				});
		});
	}); // test_ao
}

if (true) {

	tap.test('test_ao_and_shadow', function (t) {
		var _ao_topo;
		var _shaded_topo;
		var _city_topo;
		var _ambient_city;

		function _do_draw_ambient_cit_post(err, ambient_city) {
		_ambient_city = ambient_city;
			if (_STATE) console.log('_draw_post');
			ambient_city.draw(_path('citygrid_ambient.png'), function(){
				t.end();
			}, _grayscale_to_color);
		}

		function _blend_city_and_ao(err, shaded_topo) {
			if (_STATE) console.log('_blend_city_and_ao');
			_shaded_topo = shaded_topo;
			var i = 0;
			_city_topo.combine(_do_draw_ambient_cit_post, _ao_topo,
				function (city, ao) {
					if(!(++i % 40)) console.log('aos: %s, city: %s', ao, city);
					return (city + ao);
				}, true);

		}

		function _draw_shaded(err, shaded_topo) {
			if (_STATE) console.log('_draw_shaded');
			_shaded_topo = shaded_topo;
			shaded_topo.draw(_path('citygrid_shaded.png'), _blend_city_and_ao, _float_to_color)
		}

		function _get_shaded() {
			if (_STATE) console.log('_get_shaded');
			_city_topo.filter( _draw_shaded,
				shade_filter, true);
		}

		function _draw_ambient_city(err, ambient_city){
			if (_STATE) console.log('_draw_ambient_city');
			_ambient_city = ambient_city;
			_ambient_city.draw(_path('citygrid_ambient_analysis.png'), _get_shaded, _d_grayscale_to_color)
		}

		function _combine_city_with_ambient_shading() {
			if (_STATE) console.log('_combine_city_with_ambient_shading');
			//console.log('_shaded_topo: %s', util.inspect(_shaded_topo).substring(0, 50))
			var i = 0;
			_ao_topo.combine(_draw_ambient_city, _city_topo, function (ao_value, city_value) {
				if(!(++i % 40)) console.log('blending ambient %s, city %s', ao_value, city_value);
				return city_value + ao_value;
			}, true);

		}

		function _do_draw_ao(err, ao_topo) {
			if (_STATE) console.log('_do_draw_ao');
			_ao_topo = ao_topo;
			ao_topo.draw(_path('citygrid_ao.png'),
				_combine_city_with_ambient_shading
				, _d_grayscale_to_color
			);
		}
		
		function _make_ao_topo(){
			_city_topo.filter(_do_draw_ao, ao_filter, true);
		}

		function _draw_city_topo(){
			if (_STATE) console.log('_draw_city_topo');
			_city_topo.draw(_path('citygrid_topo.png'), _make_ao_topo, _grayscale_to_color);
		}

		function _do_make_citygrid_topo(err, citygrid_buffer) {
			if (_STATE) console.log('_do_make_citygrid_topo');
			if (err) throw err;

			var citygrid_img = new Canvas.Image();
			citygrid_img.src = citygrid_buffer;

			node_topo.TopoGrid({}, {
					source_type: 'image',
					source:      citygrid_img
				},
				function (err, city_topo) {
					city_topo.compress_to_greyscale();
					_city_topo = city_topo;
					_draw_city_topo();
				});
		}

		fs.readFile(_path('citygrid.png'), _do_make_citygrid_topo);
	}); // test_ao_and_shadow
}
