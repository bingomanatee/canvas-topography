var tap = require('tap');
var path = require('path');
var util = require('util');
var fs = require('fs');
var _ = require('underscore');
var Canvas = require('canvas');
var node_topo = require('./../index');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

var potterville_file = path.resolve(__dirname, '../test_source/potterville.png');
var rainbow5_file = path.resolve(__dirname, '../test_source/rainbow5.png');

fs.readFile(potterville_file, function (err, potterville) {
	if (err) throw err;
	var potterville_img = new Canvas.Image;
	potterville_img.src = potterville;

	fs.readFile(rainbow5_file, function (err, rainbow5) {
		if (err) throw err;
		var rainbow5_img = new Canvas.Image;
		rainbow5_img.src = rainbow5;

		/* ************************* TESTS ****************************** */

		if (true) {
			tap.test('coordinates', function (t) {
				node_topo.TopoGrid({}, {source_type: 'image', source: rainbow5_img}, function (err, rainbow5_grid) {

					var red = [255, 38, 0, 255];
					var yellow = [255, 251, 0, 255];
					var blue = [ 0, 150, 255, 255 ];

					t.deepEqual(rainbow5_grid.value(0, 0), red, '0,0 is red');
					t.deepEqual(rainbow5_grid.value(1, 0), red, '0, 1, is red');
					t.deepEqual(rainbow5_grid.value(0, 1), yellow, '1, 0 is yellow');
					t.deepEqual(rainbow5_grid.value(1, 1), yellow, '1,1 is yellow');
					t.deepEqual(rainbow5_grid.value(1, 1), yellow, '1,1 is yellow');
					var xy_index = rainbow5_grid.xy(0, 3);
					t.equal(xy_index, 15, 'xy(0,3) is 15');
					t.deepEqual(rainbow5_grid.value(0, 3), blue, '0, 3 is blue');
					t.deepEqual(rainbow5_grid.value(4, 3), blue, '4, 3 is blue');

					t.end();
				});
			}) // end tap.test 1
		}

		if (true) {
			tap.test('clone', function (t) {

				node_topo.TopoGrid({}, {source_type: 'image', source: potterville_img}, function (err, topo) {

					topo.clone(function (err, topoClone) {

						t.deepEqual(topoClone.value(0, 0), [102, 102, 102, 255]);
						topoClone.compress_to_greyscale(); // default - average.
						t.equal(topoClone._width, 14, 'topoClone 14 wide');
						t.equal(topoClone._height, 27, 'topoClone 27 high');

						t.equal(topoClone.value(0, 0), 102, 'topoClone value at 0,0');
						t.equal(topoClone.value(10, 10), 102, 'topoClone value at 10, 9');
						t.equal(topoClone.value(10, 11), 102, 'topoClone value at 10, 10');
						t.equal(topoClone.value(10, 12), 110, 'topoClone value at 10, 11');
						t.equal(topoClone.value(10, 13), 110, 'topoClone value at 10, 12');
						t.equal(topoClone.value(10, 14), 102, 'topoClone value at 10, 13');

						var e = false;
						try {
							topoClone.value(70, 70)
						} catch (err) {
							e = err;
						}
						t.ok(e, 'cant get 70 70');

					})

					t.deepEqual(topo.value(0, 0), [102, 102, 102, 255]);
					topo.compress_to_greyscale(); // default - average.
					t.equal(topo._width, 14, 'topo 14 wide');
					t.equal(topo._height, 27, 'topo 27 high');

					t.equal(topo.value(0, 0), 102, 'topo value at 0,0');
					t.equal(topo.value(10, 10), 102, 'topo value at 10, 10');
					t.equal(topo.value(10, 11), 102, 'topo value at 10, 11');
					t.equal(topo.value(10, 12), 110, 'topo value at 10, 12');
					t.equal(topo.value(10, 13), 110, 'topo value at 10, 13');
					t.equal(topo.value(10, 14), 102, 'topo value at 10, 14');

					var e = false;
					try {
						topo.value(70, 70)
					} catch (err) {
						e = err;
					}
					t.ok(e, 'cant get 70 70');

					t.end();
				});
			}) // end tap.test 2
		}

		if (true) {
			tap.test('filter hilite', function (t) {
				node_topo.TopoGrid({}, {source_type: 'image', source: potterville_img}, function (err, topo) {
					topo.compress_to_greyscale(); // default - average.
					topo.filter(function (err, topo) {

						t.equal(topo._width, 14, '14 wide');
						t.equal(topo._height, 27, '27 high');

						t.equal(topo.value(0, 0), 100, 'filtered value at 0,0');
						t.equal(topo.value(10, 10), 100, 'filtered value at 10, 9');
						t.equal(topo.value(10, 11), 100, 'filtered value at 10, 10');
						t.equal(topo.value(10, 12), 200, 'filtered value at 10, 11');
						t.equal(topo.value(10, 13), 200, 'filtered value at 10, 12');
						t.equal(topo.value(10, 14), 100, 'filtered value at 10, 13');

						t.end();
					}, function (value, index) {
						if (value > 102) return 200;
						return 100;
					});
				})

			}); // end filter test

		}

		if (true) {
			tap.test('shadow and draw', function (t) {
				var shade = require('./../index').filters.shadow({ rise: 2.5, distance: 3, fade: 1.66});
				node_topo.TopoGrid({}, {source_type: 'image', source: potterville_img}, function (err, topo) {
					topo.compress_to_greyscale(); // default - average.
					topo.filter(function (err, shaded_topo) {

						shaded_topo.combine(function (err, colored_topo) {

								//	console.log('shaded topo data: %s', util.inspect(_visualize(shaded_topo.data)));
								colored_topo.draw(path.resolve(__dirname, '../test_source/shadowed.png'), function () {
									shaded_topo.compress_to_greyscale(); // default - average.

									t.equal(shaded_topo._width, 14, 'topoShade 14 wide');
									t.equal(shaded_topo._height, 27, 'topoShade 27 high');

									t.equal(shaded_topo.value(0, 0), 102, 'topoShade value at 0,0');
									t.equal(shaded_topo.value(10, 9), 102, 'topoShade value at 10, 9');
									t.equal(shaded_topo.value(10, 10), 102, 'topoShade value at 10, 10');
									t.equal(shaded_topo.value(10, 11), 102, 'topoShade value at 10, 11');
									t.equal(shaded_topo.value(10, 12), 110, 'topoShade value at 10, 12');
									t.equal(shaded_topo.value(10, 13), 110, 'topoShade value at 10, 13');
									t.ok(shaded_topo.value(10, 14) < 102, 'topoShade value at 10, 14 < 102');
									t.ok(shaded_topo.value(10, 15) < 102, 'topoShade value at 10, 15 < 102');
									t.ok(shaded_topo.value(10, 16) < 102, 'topoShade value at 10, 16 < 102');

									t.end();
								});

							}
							, topo
							, function (shade, base, x, y) {
								var color = parseInt(shade + base);
								return [color, color, color, 255];
							}, true);
					}, shade, true);
				})

			}); // end filter test

		}

	});

});