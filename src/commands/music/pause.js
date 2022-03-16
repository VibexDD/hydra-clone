const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["pause"],

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
    if (player.paused)
      return message.channel.send({
        embed: {
          author: {
            name: "| The player is already paused",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
          color: "#E67F22",
        },
      });
    await player.setPaused(true);
    message.channel.send({
      embed: {
        author: {
          name: "|  Paused the player",
          icon_url: message.author.avatarURL({ dynamic: true }),
        },
        color: "#E67F22",
      },
    });

    updatemessage(this.client, this.client.queue.get(message.guild.id).msg);
  }
};
