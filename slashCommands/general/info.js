module.exports = {
	name: 'about',
    description: 'Info about the bot.',
    cooldown: 5,
	execute(message, args) {
        let data = [];
        data.push('CS Crew Discord bot');
        // if you dont care about versioning remove this line
        data.push(`version: ${process.env.npm_package_version}`);

        // if you care about listing contributors, can probably pull from github api?
        // data.push('author: ');
        
        // todo: replace with forked/crew hosted repo version
        data.push('repo: https://github.com/cadeluca/crew-bot')
        
		message.channel.send(data, {split: true});
	},
};