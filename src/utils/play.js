const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const e = require("express");
const { Song } = require("soundcloud-scraper");
const config = require("../../config.json");
const {
  format,
  escapeRegex,
  delay,
  updatemessage,
  findOrCreateGuild,
} = require("./functions");
const { getData, getPreview, getTracks } = require("spotify-url-info");

module.exports = async (client, message, args) => {
  function checkURL(string) {
    try {
      new URL(string);
      return true;
    } catch (error) {
      return false;
    }
  }

  const node = client.shoukaku.getNode();
  const query = args.join(" ");
  if (client.utils.isSoundCloud(query)) {
    const searchData = await node.rest.resolve(`${query}`);
    if (!searchData || !searchData.tracks.length)
      return console.log("SC - Not found ");
    const { type, tracks } = searchData;
    if (type === "PLAYLIST") {
      for (const track of tracks) {
        let scsongg = await client.soundcloud.getSongInfo(track.info.uri);
        track.info.title = scsongg.title;
        track.info.thumbnail = scsongg.thumbnail;
        track.info.requester = message.author;
        const res = await client.queue.handle(node, track, message);
        if (res) await res.play();
        updatemessage(client, message);
      }
    } else {
      const track = searchData.tracks.shift();
      let scsongg = await client.soundcloud.getSongInfo(track.info.uri);
      track.info.title = scsongg.title;
      track.info.thumbnail = scsongg.thumbnail;
      track.info.requester = message.author;
      const res = await client.queue.handle(node, track, message);
      if (res) await res.play();
      updatemessage(client, message);
    }
  } else if (client.utils.isSpotify(query)) {
    if (client.lavasfy.isValidURL(query)) {
      let spotifyNode = client.lavasfy.getNode();
      const {
        loadType,
        playlistInfo: { name },
        tracks,
      } = await spotifyNode.load(query).catch(() => {
        return message.channel.send(
          util
            .embed()
            .setAuthor(
              " |  An error occured while searching tracks",
              message.author.displayAvatarURL({ dynamic: true })
            )
        );
      });
      if (!tracks || !tracks.length)
        return await message.channel.send(
          new MessageEmbed().setAuthor(
            " |  Couldn't find anything in the query you gave me",
            message.author.displayAvatarURL({ dynamic: true })
          )
        );

      if (loadType === "PLAYLIST_LOADED") {
        for (const track of tracks) {
          let spo = await getPreview(track.info.uri);
          track.info.thumbnail = spo.image ? spo.image : null;
          track.info.requester = message.author;
          const res = await client.queue.handle(node, track, message);
          if (res) await res.play();
          await updatemessage(client, message);
        }
        message.channel.send(
          new MessageEmbed().setAuthor(
            ` |  Loaded ${tracks.length} tracks from: ${name}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
        );
      } else {
        const track = tracks[0];
        let spo = await getPreview(track.info.uri);
        track.info.thumbnail = spo.image ? spo.image : null;
        track.info.requester = message.author;
        const res = await client.queue.handle(node, track, message);
        updatemessage(client, message);
      }
    }
  } else {
    const searchData = await node.rest.resolve(query, "youtube");
    if (!searchData || !searchData.tracks.length)
      return console.log("YT - Not found ");
    const track = searchData.tracks.shift();
    track.info.thumbnail = track.info.uri.includes("youtube")
      ? `https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`
      : null;
    track.info.requester = message.author;
    const res = await client.queue.handle(node, track, message);
    if (res) await res.play();
    updatemessage(client, message);
  }
};
