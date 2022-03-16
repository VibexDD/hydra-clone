const Command = require("../../Structures/Command");
const fastForwardNum = 10;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["fwd"],

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
    const player = client.queue.get(message.guild.id);

    if (args[0] && !isNaN(args[0])) {
      if (
        player.player.position + args[0] * 1000 <
        player.current.info.length
      ) {
        player.player.seekTo(player.player.position + args[0] * 1000);

        const parsedDuration = client.formatDuration(
          player.player.position + args[0] * 1000
        );
        return message.channel.send({
          embed: {
            author: {
              name: `| Forwarded to ${parsedDuration}`,
              value: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      } else {
        return message.channel.send(
          "Cannot forward beyond the song's duration."
        );
      }
    } else if (args[0] && isNaN(args[0])) {
      return message.reply(
        `Invalid argument, must be a number.\nCorrect Usage: \`c!forward <seconds>\``
      );
    }

    if (!args[0]) {
      if (
        player.player.position + fastForwardNum * 1000 <
        player.current.info.length
      ) {
        player.player.seekTo(player.player.position + fastForwardNum * 1000);

        const parsedDuration = client.formatDuration(
          player.player.position + 10000
        );

        return message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: `| Forwarded to ${parsedDuration}`,
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      } else {
        return message.channel.send(
          "Cannot forward beyond the song's duration."
        );
      }
    }
  }
};
