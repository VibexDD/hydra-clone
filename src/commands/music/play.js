const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["p"],
      description: "...",
      category: "Music",
      args: false,
      vc: true,
      sameVc: true,
      playing: false,
    });
  }

  async run(message, args) {
    const msg = message;

    function checkURL(string) {
      try {
        new URL(string);

        return true;
      } catch (error) {
        return false;
      }
    }

    if (!message.member.voice.channelID) {
      return message.channel.send({
        embed: {
          color: this.client.color,
          author: {
            name: "|  You aren't connected to a voice channel",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
    } else if (
      message.guild.me.voice.channel &&
      !message.guild.me.voice.channel.equals(message.member.voice.channel)
    ) {
      return message.channel.send({
        embed: {
          color: this.client.color,
          author: {
            name: "|  You aren't connected to the same voice channel as I am",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
    }

    const node = this.client.shoukaku.getNode();

    if (!args && message.attachments.size > 0) {
      let o;

      let x = message.attachments
        .filter((x) => x.name.includes(".mp3"))
        .map((x) => x)[0];

      let r = await node.rest.resolve(x.proxyURL);

      const { tracks } = r;

      let u = tracks.shift();

      u.info.title = x.name;

      u.info.requester = msg.author;

      let rr = await this.client.queue.handle(node, u, message);

      if (this.client.queue.get(msg.guild.id).current)
        msg.channel.send({
          embed: {
            color: this.client.color,

            description: `[${u.info.title}](${
              u.info.uri
            }) [${this.client.formatDuration(u.info.length)}]`,

            author: {
              name: `| Queued at position #${
                this.client.queue.get(msg.guild.id).queue.length
              }`,

              icon_url: msg.author.avatarURL({ dynamic: true }),
            },
          },
        });

      if (rr) await rr.play();
    } else if (args) {
      const query = args;

      if (checkURL(query)) {
        const result = await node.rest.resolve(query);

        if (!result)
          return await msg.channel.send(
            "Admiral, I didn't find anything in the query you gave me"
          );

        const { type, tracks, playlistName, length } = result;

        const track = tracks.shift();

        track.info.thumbnail = track.info.uri.includes("youtube")
          ? `https://img.youtube.com/vi/${track.info.identifier}/maxresdefault.jpg`
          : null;

        track.info.requester = msg.author;

        const isPlaylist = type === "PLAYLIST";

        const res = await this.client.queue.handle(node, track, message);

        if (isPlaylist) {
          for (const track of tracks)
            await this.client.queue.handle(node, track, message);

          await msg.channel.send(`🎶 **${playlistName}** Added to **Queue**`);
        }

        if (this.client.queue.get(msg.guild.id).current)
          msg.channel.send({
            embed: {
              color: this.client.color,

              description: `[${track.info.title}](${
                track.info.uri
              }) [${this.client.formatDuration(track.info.length)}]`,

              author: {
                name: `| Queued at position #${
                  this.client.queue.get(message.guild.id).queue.length
                }`,
                icon_url: msg.author.avatarURL({ dynamic: true }),
              },
            },
          });

        if (res) await res.play();

        return;
      }

      const searchData = await node.rest.resolve(query, "youtube");

      if (!searchData.tracks.length)
        return await msg.channel.send(
          "I didn't find anything in the query you gave me"
        );

      const track = searchData.tracks.shift();

      track.info.thumbnail = track.info.uri.includes("youtube")
        ? `https://img.youtube.com/vi/${track.info.identifier}/maxresdefault.jpg`
        : null;

      track.info.requester = msg.author;

      const res = await this.client.queue.handle(node, track, msg);

      if (this.client.queue.get(msg.guild.id).current) {
        await msg.channel
          .send({
            embed: {
              author: {
                name: `| Queued at position #${
                  this.client.queue.get(msg.guild.id).queue.length
                }`,
                icon_url: message.author.avatarURL({ dynamic: true }),
              },
              color: this.client.color,
              description: `[${track.info.title}](${
                track.info.uri
              }) [${this.client.formatDuration(track.info.length)}]`,
            },
          })
          .catch(() =>
            msg.channel.send(
              "**❌ There was some error while adding the song!**"
            )
          );
      }

      if (res) await res.play();
    } else
      return msg.channel.send({
        embed: {
          color: this.client.color,

          author: {
            name: "|  You didn't specify a link or search terms",

            icon_url: msg.author.avatarURL({ dynamic: true }),
          },
        },
      });
  }
};
