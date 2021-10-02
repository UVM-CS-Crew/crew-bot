const { Octokit } = require('@octokit/rest');

require('dotenv').config();

module.exports = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});