const Command = require("../../Structures/Command");
const rewindNum = 10;
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
    const client = this.client;
    const player = client.queue.get(message.guild.id).player;
    const parsedDuration = client.formatDuration(
      player.position - args[0] * 1000
    );

    if (args[0] && !isNaN(args[0])) {
      if (player.position - args[0] * 1000 > 0) {
        player.seekTo(player.position - args[0] * 1000);

        return message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: `| Rewinding to ${parsedDuration}`,
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      } else {
        return message.channel.send("Cannot rewind beyond 00:00.");
      }
    } else if (args[0] && isNaN(args[0])) {
      return message.reply(
        `Invalid argument, must be a number.\nCorrect Usage: \`${client.settings.prefix}forward <seconds>\``
      );
    }

    if (!args[0]) {
      if (player.position - rewindNum * 1000 > 0) {
        const ps = client.formatDuration(player.position - 10000);
        player.seekTo(player.position - rewindNum * 1000);

        return message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: `| Rewinding to ${ps}`,
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      } else {
        return message.channel.send("Cannot rewind beyond 00:00.");
      }
    }
  }
};
