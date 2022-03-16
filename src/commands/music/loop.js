const sastaLoop = new Map();

const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["l"],

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

    const queue = client.queue.get(message.guild.id);

    if (!args[0]) {
      const xd = sastaLoop.get(message.guild.id);

      if (xd == 1) {
        sastaLoop.set(message.guild.id, 1);

        queue.trackloop = true;

        queue.queueloop = false;

        message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: "|  Now looping the current track",
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      } else if (xd == null || xd == 0) {
        sastaLoop.set(message.guild.id, 2);

        queue.trackloop = false;

        queue.queueloop = true;

        message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: "|  Now looping the queue",
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      } else if (xd == 2) {
        sastaLoop.set(message.guild.id, 0);

        queue.trackloop = false;

        queue.queueloop = false;

        message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: "| Now looping nothing",
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      }
    } else if (args[0]) {
      if (args[0] == "song" || args[0] == "track") {
        queue.trackloop = true;

        queue.queueloop = false;

        message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: "|  Now looping the current track",
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      } else if (args[0] == "queue" || args[0] == "all") {
        queue.trackloop = false;

        queue.queueloop = true;

        message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: "|  Now looping the queue",
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      } else if (args[0] == "disable" || args[0] == "off") {
        queue.trackloop = false;

        queue.queueloop = false;

        message.channel.send({
          embed: {
            color: "#E67F22",
            author: {
              name: "| Now looping nothing",
              icon_url: message.author.avatarURL({ dynamic: true }),
            },
          },
        });
      }
    }
  }
};
