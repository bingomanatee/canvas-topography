var Gate = require('gate');
var _ = require('underscore');

module.exports = {
	TopoGrid: require('./lib/TopoGrid'),
	filters:  {
		shadow:     require('./lib/filters/shadow'),
		ao:         require('./lib/filters/ambient_occlusion'),
		aoi:        require('./lib/filters/aoi'),
		normal_map: require('./lib/filters/normal_map')
	},

	util: {
		Vector3:      require('./lib/util/vector3'),
		cross_vector: require('./lib/util/cross_vector')
	},

	image_file_topos: function (image_files, cb) {
		var gate = Gate.create();

		var TopoGrid = require('./lib/TopoGrid');

		_.each(image_files, function (file) {
			TopoGrid({}, {source: file, source_type: 'image_file'}, gate.latch());
		});

		gate.await(function (err, topo_grids) {
			cb(null, _.reduce(_.values(topo_grids),
				function (out, props) {
					if (props[0]) throw props[0];
					out.push(props[1]);
					return out;
				}, []));
		});
	}
};