module.exports = {
	name: 'error',
	once: false,
	async execute(error, client) {
		console.error(error);
	},
};