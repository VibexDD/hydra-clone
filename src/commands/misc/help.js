const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {

			aliases: ['help'],

			description: '...',

			category: 'Misc',

			args: false

		});

	}

	async run(message, args) {
		message.channel.send({
			embed: {
				color: this.client.colors.crimson,

				fields: [
					{
						name: `Admin [${this.client.commands.filter(
							x => x.category.toLowerCase() === "admin"
						).size
							}]`,

						value: this.client.commands
							.filter(x => x.category.toLowerCase() === "admin")
							.map(x => `\`${x.name}\``)
							.join(", ")
					},
					{
						name: `Music [${this.client.commands.filter(
							x => x.category.toLowerCase() === "music"
						).size
							}]`,

						value: this.client.commands
							.filter(x => x.category.toLowerCase() === "music")
							.map(x => `\`${x.name}\``)
							.join(", ")
					},
					{
						name: `Miscellaneous [${this.client.commands.filter(x => x.category.toLowerCase() == "misc").size
							}]`,

						value: this.client.commands
							.filter(x => x.category.toLowerCase() === "misc")
							.map(x => `\`${x.name}\``)
							.join(", ")
					}
				],

				description:
						`[Invite](https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=applications.commands%20bot&permissions=8) - [Support Server](https://discord.gg/XndngNV7tx)`,

				author: {
					name: "| Help Menu",
					icon_url: message.author.avatarURL({ dynamic: true })
				}
			}
		});
	}
}