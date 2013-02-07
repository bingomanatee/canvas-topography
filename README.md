canvas-topography
=================

A Node module for manipulating 2-d data; it is intended as a library for canvas data manipulation, but any
scenario where 2d manipulation of content is required might find this useful.

Data is stored in a flat array, accessed by interpolation of x-y based on width and height of the dataset.
Data can be any sort of format you like - numeric, objects, strings, etc.

The node-topography-canvas library requires data to be arrays of four numbers 0..255 (pref. integral). However,
intermediary data states, such as integral data, are required to drive filters in certain scenarios.

## API

### factory(mixins, config)

The factory initializes and returns a new TopoGrid. The form and digestion pattern of the input
depends on the values of config.

* If you want to insert array data into the grid directly,
  assert {source: <your data array>, source_type: 'array', width: <int>, height: <int>}

* You can also assert a "data factory function" that takes (x, y) and returns a value. It will be bound to the
TopoGrid.

* You can load in images asnd canvas using the node-topography-canvas mixin as well.

### neighbors(x, y, range) and neighbor_values(x, y, range, asInt)

Neighbors returns an array of data within +/- range; only "good" data (data for coordinates on the grid) are returned.

For each value an object is returned:

```javascript
{
	x:  x_value,
	y: y_value,
	distance:      self.distance(x, y, x_value, y_value),
	orth_distance: self.orth_distance(x, y, x_value, y_value),
	x_offset:      x_value - x,
	y_offset:      y_value - y,
	value:         xy_value,
	rise:          xy_value - value // if both values are numeric
}
```
Other than rise, all the properties are related to the x, y coordinates and don't depend on the actual value being any
specific format.

Neighbor values return a pure array of the values; while there is no explicit data or promise of which value came
from what x,y coordinate, they are currently returned in x, y order. This is best for when positionless statistics on
 a group of data is required.

the "ring" parameter forces the neighbor method to return boundry values only - so a neighbor(3, 4,
2) would return data from point (2,3), but neighbor (3, 4, 2, true) would not.

## Combine(cb, other_topo, combiner_filter, clone)

Combine merges two TopoGrids. If clone is true, the combination is returned as a third, new topo; if not,
the combination overwrites the first ( calling) grid. The grids are assumed to be the same size.

The combine_filter is bound to the first grid and has the api(gridA_value, gridB_value, x,
y); the result of the combinder_filter is asserted into the clone, or the first grid.

## xy(x, y)

returns the data array index of a coordinate pair. throws an error for off-grid points.

## deindex(index)

returns a two-value array for a given data array offset.

## value(x, y) | value(xy_array)

returns the data at a given coordinate

## xy_good(x, y)

returns a boolean for whether or not the point is in the 0...width, 0..height range.

## compress_to_greyscale(method)

compresses image data to a single value in the 0..255 range. How it does so depends on input:

'r', 'g', 'b', 'a' will take a single channel and get that value.

'avg' (or no input) will average the first three array values.

note, in most cases, opacity is ignored. 


