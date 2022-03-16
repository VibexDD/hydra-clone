const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: [],
      description: "...",
      category: "Music",
      args: false,
      vc: true,
      sameVc: true,
      playing: true,
    });
  }
  async run(message, args) {
    this.client.queue.get(message.guild.id).queue = [];
    message.channel.send({
      embed: {
        color: "#E67F22",
        author: {
          name: "|  Removed every track from the queue",
          icon_url: message.author.avatarURL({ dynamic: true }),
        },
      },
    });
  }
};
