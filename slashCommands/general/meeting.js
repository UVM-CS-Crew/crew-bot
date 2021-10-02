module.exports = {
	name: 'meeting',
    description: 'Info about the next CS Crew meeting.',
    cooldown: 5,
	execute(message, args) {
        let data = [];
        data.push('**Next CS Crew Meeting**');
        // meeting date for sure, then whatever you decide - topic, links, etc.?

		message.channel.send(data, {split: true});
	},
};