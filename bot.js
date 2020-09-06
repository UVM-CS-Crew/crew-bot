const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// uncomment this if firebase used
// let db = require('./config.js');

// if you want a configurable prefix, I suggest using firebase to store the value, 
// read from it on bot boot and update it through a prefix command (or a nested settings command),
// having the hardcoded prefix as a fallback.
/**
let prefixDocRef = db.collection("collection id here").doc("doc id here");
prefixDocRef.onSnapshot(function(docSnapshot) {
	prefixDocRef.get().then(function(doc) {
		prefix = doc.data()['value'];
	});
})
*/
const prefix = '!';

client.once('ready', () => {
		console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return; 

    // optional more strict args filterings
    // const args = message.content.slice(prefix.length).split(/ +/);

	const args = message.content.slice(prefix.length).match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);


	// if command missing required arguments 
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// message cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
	
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}

});

// also use an env variable here
client.login('login key here');