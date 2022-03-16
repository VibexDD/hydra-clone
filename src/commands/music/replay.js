const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: [],

      description: "...",

      category: "Music",
      voteOnly: true,
      args: false,
      vc: true,

      sameVc: true,

      playing: true,
    });
  }

  async run(message, args) {
    this.client.queue.get(message.guild.id).player.seekTo(0);

    return message.channel.send({
      embed: {
        color: "#E67F22",
        author: {
          name: `|  Replaying ${
            this.client.queue.get(message.guild.id).current.info.title
          }`,
          icon_url: message.author.avatarURL({ dynamic: true }),
        },
      },
    });
  }
};
