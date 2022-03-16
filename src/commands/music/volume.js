const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["v"],

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
    const dispatcher = this.client.queue.get(message.guild.id);
    if (!args[0] || isNaN(args[0]))
      return await message.channel.send({
        embed: {
          color: "#E67F22",
          author: {
            name: `| The current playback volume is ${
              dispatcher.player.filters.volume * 100
            }%`,
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });

    const volume = Number(args[0]);

    if (volume < 1 || volume > 500)
      return await message.channel.send({
        embed: {
          color: "#E67F22",
          author: {
            name: "|  Please input a number between 1% and 500%",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });

    await dispatcher.player.setVolume(volume / 100);

    return message.channel.send({
      embed: {
        color: "#E67F22",
        author: {
          name: `|  The current playback volume is ${volume}%`,
          icon_url: message.author.avatarURL({ dynamic: true }),
        },
      },
    });
  }
};
