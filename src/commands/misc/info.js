const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {

			aliases: [],

			description: '...',

			category: 'Music',

			args: false

		});

	}

	async run(message, args) {
		this.client.config.owners.forEach(async b => {
			await this.client.users.fetch(b)
		})
		message.channel.send({
			embed: {
				color: this.client.colors.crimson,
				thumbnail: { url: this.client.user.avatarURL() },
				fields: [
					{ name: 'Developer', value: `Vibe xD#1505` },
					{ name: 'RAM Usage', value: this.client.utils.formatBytes(process.memoryUsage().heapUsed) + ' MB' },
					{ name: 'Ping', value: Math.round(this.client.ws.ping) + ' ms' },
					{ name: 'Guild ID', value: message.guild.id },
					{ name: 'Lavalink Node Name', value: `${this.client.queue.get(message.guild.id) ? this.client.queue.get(message.guild.id).player.voiceConnection.node.name : 'Node-00'}` }
				],
				author: { name: `|  ${this.client.user.username} Information`, icon_url: message.author.avatarURL({ dynamic: true }) }
			}
		})









	}
}
