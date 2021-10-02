// if we find a different hosting platform, scrap this
//  heroku works well, with a verified account (still free but requires credit card added to account) there are enough
//  service worker hours to run a discord bot 24/7; a standard free account will shut down around the 20~ish of each month.

const Heroku = require('heroku-client');

const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });

module.exports = heroku;