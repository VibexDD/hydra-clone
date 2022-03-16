const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const play = require("./play");
module.exports = async (client, message) => {
  if (message.author.id === client.user.id)
    message
      .delete({ timeout: 4000 })
      .catch((e) =>
        console.log("Couldn't delete msg, this is for preventing a bug")
      );
  else
    message
      .delete()
      .catch((e) =>
        console.log("Couldn't delete msg, this is for preventing a bug")
      );

  if (message.author.bot) return;
  const { channel } = message.member.voice;

  if (!channel) return;
  const player = client.queue.get(message.guild.id);
  if (player && channel.id !== message.guild.me.voice.channelID) return;
  const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);
  const prefixRegex = message.content.match(mentionRegexPrefix)
    ? message.content.match(mentionRegexPrefix)[0]
    : message.guild.data.prefix;
  var args;
  var cmd;
  if (message.content.startsWith(prefixRegex)) {
    [cmd, ...args] = message.content
      .slice(prefixRegex.length)
      .trim()
      .split(/ +/);
    cmd = cmd.toLowerCase();
  } else {
    args = message.content.trim().split(/ +/);
    cmd = args.shift().toLowerCase();
  }

  if (cmd.length === 0) return;
  let command = client.commands.get(cmd.toLowerCase());
  if (command) command.run(message, args);
  else {
    if (
      message.guild.data.vcs.length &&
      !message.guild.data.vcs.includes(channel.id)
    )
      return;
    else return play(client, message, message.content.trim().split(/ +/));
  }
};
