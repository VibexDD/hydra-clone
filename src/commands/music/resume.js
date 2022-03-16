const Command = require("../../Structures/Command");
const {
  format,
  escapeRegex,
  delay,
  updatemessage,
  findOrCreateGuild,
} = require("../../utils/functions");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["unpause", "continue", "r"],

      description: "...",

      category: "Music",

      args: false,
      vc: true,

      sameVc: true,

      playing: true,
    });
  }

  async run(message, args) {
    const player = this.client.queue.get(message.guild.id).player;
    if (!player.paused)
      return message.channel.send({
        embed: {
          author: {
            name: "| The player is not paused",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
          color: "#E67F22",
        },
      });
    await player.setPaused(false);
    message.channel.send({
      embed: {
        author: {
          name: "| Resumed the player",
          icon_url: message.author.avatarURL({ dynamic: true }),
        },
        color: "#E67F22",
      },
    });
    updatemessage(this.client, this.client.queue.get(message.guild.id).msg);
  }
};
