// requires proper configuaration with octokit/github, and repo needs proper labels setup
// labels can be changed and new cases can be added as seen fit

// figuring out the formatting for this is a bit clunky, right now it looks like this:
//
// !issue bug "meeting command displays wrong dates" "the meeting command is displaying the wrong day, maybe the server time zone"
// or
// !issue request "officer command" "i would like a command that lists all current officers"
//
// if a better format than the quote escaped title and body is found, please adjust accordingly. 

module.exports = {
	name: 'issue',
	description: 'Submit an issue to the bot github repository; bug reports and feature requests. Note: keep it professional.',
	cooldown: 10,
	usage: "bug/['request' or 'feature'] \"[title for feature]\" \"[description for feature]\"\nExamples: `bug \"prefix resets on restart\" \"the custom set prefix is reset back to the default prefix after a restart\"`, `request \"item command\" \"I would like a command that can return info on item stats and cost\"`",
	args: true,
	execute(message, args) {
        // maybe move this out to bot.js level if that works?
		const { Octokit } = require("@octokit/rest");
		const botUserToken = 'bot user token here, better yet use another env variable';

		const octokit = new Octokit({
			auth: botUserToken,
		});

		async function buildIssue(label, name, content) {
            // todo: needs exception handling on failure to create issue
			const issue = await octokit.issues.create({
				owner: "repo owner here",
				repo: "crew-bot",
				title: `${name.slice(1, -1)}`,
				labels: [label],
				body: content.slice(1, -1)
			  });
			return issue;
		}

		let label;

        // probably could do with a map here if more cases get added
		if (args[0] === 'bug') {
			label = 'bug';
			buildIssue(label, args[1], args[2]).then(message.channel.send("Bug report issue created and submitted, thank you!"))
		} else if (args[0] === 'request' || args[0] === 'feature') {
			label = 'feature request'
			buildIssue(label, args[1], args[2]).then(message.channel.send("Feature request issue created and submitted, thank you!"))
		} else {
			message.channel.send("Incorrect issue submission format.")
		}
	}
};
