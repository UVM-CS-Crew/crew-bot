const octokit = require('../api/octokit');

exports.getLatestRelease = async () => {
	try {
		const fullRelease = await octokit.repos.getLatestRelease({
			owner: 'cscrew',
			repo: 'crew-bot'
		});
		const release = fullRelease.data;

		return {
			name: release.name,
			body: release.body,
			tag: release.tag_name,
			branch: release.target_commitish,
			draft: release.draft,
			prerelease: release.prerelease,
			createTime: release.created_at,
			publishTime: release.published_at,
			author: release.author.login,
			authorAvatar: release.author.avatar_url
		};
	} catch (e) {
		// better than nothing, but needs some formal tlc
		console.log(e);
		return null;
	}
};

exports.buildReleaseEmbed = (release) => {
	console.log(release);
	// if it doesnt look good as the author, move this to footer -> .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
	const releaseNotesEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`Release ${release.tag} - ${release.name}`)
		.setAuthor(`Release by ${release.author}`, release.authorAvatar)
		.setDescription(release.body)
		.addFields(
			{ name: 'Source Branch:', value: release.branch, inline: true },
			{ name: 'Status:', value: release.draft ? 'Draft' : 'Published', inline: true },
			{ name: 'Stablity:', value: release.prerelease ? 'Pre-release, this release is non-production ready' : 'Production ready', inline: true },
			{ name: 'Created at:', value: this.parseTimeToLocal(release.createTime, ' '), inline: true },
		);

	// todo: test if draft/pre-releases are missing the publish field
	if (release.publishTime !== null) {
		releaseNotesEmbed.addField('Published at:', this.parseTimeToLocal(release.publishTime, ' '), true);
	}
	// .setImage() todo: if we set up a repo image
	// .setURL('') todo: add release url

	return releaseNotesEmbed;
};
