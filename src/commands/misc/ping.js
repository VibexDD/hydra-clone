const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {

			aliases: ['pong'],

			description: 'This provides the ping of the bot',

			category: 'Misc'

		});

	}

	async run(message) {
		const latency = Date.now() - message.createdTimestamp;
		message.channel.send({
			embed: {
				author: {
					name: '| Pong',
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: this.client.colors.crimson,
				description: `\`\`\`Gateway Ping : ${Math.round(this.client.ws.ping)}ms\nRest Ping    : ${latency}ms\`\`\``
			}
		})
	}

};