module.exports = {
	TopoGrid: require('./lib/TopoGrid'),
	filters:  {
		shadow: require('./lib/filters/shadow'),
		ao:     require('./lib/filters/ambient_occlusion')
	}
};