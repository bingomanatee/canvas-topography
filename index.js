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
	}
};