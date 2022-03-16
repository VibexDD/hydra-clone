const Command = require('../../Structures/Command');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['inv'],
			description: '...',
			category: 'Misc',
			args: false
		});
	}

	async run(message, args) {
		message.channel.send({
			embed: {
				color: this.client.colors.crimson,
				description: `[${this.client.user.username}](https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot)`,
				author: { name: `| Invite ${this.client.user.username}`, icon_url: message.author.avatarURL() }
			}
		})
	}
}
