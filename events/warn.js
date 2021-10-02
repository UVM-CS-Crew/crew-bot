module.exports = {
	name: 'warn',
	once: false,
	async execute(warning, client) {
		console.warn(warning);
	},
};