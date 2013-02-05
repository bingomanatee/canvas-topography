var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var node_topo = require('./../index');
var fs = require('fs');
var Vector3 = node_topo.util.Vector3;
var cross_vector = node_topo.util.cross_vector;
var ab_vector = cross_vector.ab_vector;
var z_from_xy = cross_vector.z_from_xy;

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

var radius = 20;
var r2 = radius * radius;
var cx = 25;
var cy = 30;

var bump_filter = function (x, y) {

	var dx = cx - x;
	var dy = cy - y;

	var distance = Math.sqrt(dx * dx + dy * dy);
	if (distance < radius) {
		return Math.sqrt(r2 - dx * dx - dy * dy);
	} else {
		return 0;
	}
};

function _path(file) {
	return path.resolve(__dirname, '../test_source/', file);
}

var normal_map_filter = node_topo.filters.normal_map({});

var aoi_filter = node_topo.filters.aoi({light_x: 0, light_y: -0.5});

function p100(vp) {
	return [Math.round(vp.x * 100), Math.round(vp.y * 100), Math.round(vp.z * 100)];
}

/* ************************* TESTS ****************************** */

if (true) {
	tap.test('test_normal', function (t) {
		node_topo.TopoGrid({
			_width:  60,
			_height: 60
		}, {
			source:      bump_filter,
			source_type: 'function',
			width:       60,
			height:      60
		}, function (err, topo) {

			function _on_draw_aoi() {
				console.log('_on_draw_aoi');
				topo.filter(
					function (err, aol_topo) {
						console.log('drawing aol_topo');
						aol_topo.draw(_path('normal_aoi.png'),
							function () {
								t.end();
							}, _.identity);
					},
					aoi_filter
				);
			}

			function _on_draw_normal_normal(err, normal_topo) {
				console.log('drawing normal map from normal_topo');


				normal_topo.draw(_path('normal_normal.png'),
					_on_draw_aoi
					, _.identity);
			}

			function _on_draw_normal_map() {
				console.log('done drawing height map');
				topo.filter(_on_draw_normal_normal, normal_map_filter, true);
			}

			topo.draw(_path('normal_heightmap.png'),
				_on_draw_normal_map,
				function (value, x, y) {
					var color = (255 * value / 20.0);
					return [color, color, color, 255];
				}
			);
		});
	}) // end tap.test 1
}

if (true) {
	tap.test('vector3', function (t) {
		var v1 = new Vector3(1, 0, 0);
		var v2 = new Vector3(0, 1, 0);
		var right_angle = v1.angleTo(v2);
		var to_deg = 180 / Math.PI;

		t.equal(Math.round(to_deg * right_angle), 90, 'right angle');

		var fortyfive_angle = new Vector3(1, 1, 0).angleTo(v1);

		t.equal(Math.round(to_deg * fortyfive_angle), 45, '45 degree angle');

		t.end();
	})
}

if (true) {
	tap.test('cross_vector', function (t) {
		var vp = cross_vector(0, 0, 0, 0, 0, 1);
		t.deepEqual([vp.x, vp.y, vp.z], [0, 0, 1], 'flat cross_vector == straight normal');

		vp = cross_vector(0, 1, -1, 0, 0, 1);
		var s200 = Math.round(100 * Math.sqrt(1 / 2));
		t.deepEqual(p100(vp), [0, s200, s200], 'leaning 45 degrees south');

		vp = cross_vector(0, 0, 0, 1, -1, 1);
		t.deepEqual(p100(vp), [s200, 0, s200], 'leaning 45 degrees westward');

		vp = cross_vector(0, 1, null, 0, 0, 1);
		t.deepEqual(p100(vp), [0, s200, s200], 'leaning 45 degrees south at southern edge');

		vp = cross_vector(0, 0, 0, 1, null, 1)
		t.deepEqual(p100(vp), [s200, 0, s200], 'leaning 45 degrees westward at eastern edge');

		t.end();

	})
}