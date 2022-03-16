const ms = require("ms");
//const reset = require('./reset');
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports.getMember = getMember;
module.exports.shuffle = shuffle;
module.exports.formatDate = formatDate;
module.exports.duration = duration;
module.exports.promptMessage = promptMessage;
module.exports.delay = delay;
module.exports.getRandomInt = getRandomInt;
module.exports.getRandomNum = getRandomNum;
module.exports.format = format;
module.exports.escapeRegex = escapeRegex;
module.exports.arrayMove = arrayMove;
module.exports.updatemessage = updatemessage;

async function updatemessage(client, message) {
  //  if (message.channel.id !== message.data.guild.mch) return
  const msg = await message.guild.channels.cache
    .get(message.data.guild.mch)
    .messages.fetch(message.data.guild.msg);
  const player = client.queue.get(message.guild.id);
  if (!player) return reset(client, message);
  const current = player.current;
  const queue = player.queue;
  if (!current) return reset(client, message);
  else {
    let thumbnail = current.info.thumbnail;
    let loopmethod = false;
    if (player.trackloop) loopmethod = "song";
    else if (player.queueloop) loopmethod = "queue";
    let num = 1;
    if (!current.info.thumbnail)
      thumbnail =
        "https://cdn.discordapp.com/attachments/863721460974485504/889773715632582716/20210920_163032.png";
    const emb = new MessageEmbed()
      .setTitle(`[${format(current.info.length)}] - ${current.info.title}`)
      .setDescription(
        message.guild.data.requesterOn
          ? `${
              current.info.requester
                ? `Requested by: ${current.info.requester}`
                : ""
            }`
          : ""
      )
      .setColor("#9695e0")
      .setImage(thumbnail)
      .setFooter(
        `${queue.length} songs in queue | Volume: ${
          player.player.filters.volume * 100
        }%${player.player.paused ? " | Song paused" : ""}${
          loopmethod ? ` | Loop: ${loopmethod}` : ""
        }`
      );
    const str = `** **\n**__Queue list:__**\n\n${
      queue.length > 15 ? `And **${queue.length - 15}** more...\n` : ""
    }${
      queue.length > 0
        ? `${queue
            .slice(0, 15)
            .map(
              (n) => `${num++}. ${n.info.title} - [${format(n.info.length)}]`
            )
            .reverse()
            .join("\n")}`
        : "Join a voice channel and queue songs by name or url in here."
    }`;
    msg.edit(str, emb);
  }
}

async function reset(client, message) {
  if (message.channel.id !== message.data.guild.mch) return;
  const msg = await message.guild.channels.cache
    .get(message.data.guild.mch)
    .messages.fetch(message.data.guild.msg);
  let resetemb = new MessageEmbed()
    .setImage(
      "https://cdn.discordapp.com/attachments/874529756425625607/885549944122011688/d2b180672154a29561750e6f4147ede3a9fa1735.png"
    )
    .setColor("#9695e0")
    .setTitle("No song playing currently")
    .setDescription(
      "[Invite](https://moosic.live/invite) | [Commands](https://moosic.live/commands) | [Support](https://moosic.live/discord)"
    )
    .setFooter(`Prefix for this server is: ${message.data.guild.prefix}`);
  msg.edit(
    `**__Queue list:__**\nJoin a voice channel and queue songs by name or url in here.`,
    resetemb
  );
}

function getMember(message, toFind = "") {
  try {
    toFind = toFind.toLowerCase();
    let target = message.guild.members.get(toFind);
    if (!target && message.mentions.members)
      target = message.mentions.members.first();
    if (!target && toFind) {
      target = message.guild.members.find((member) => {
        return (
          member.displayName.toLowerCase().includes(toFind) ||
          member.user.tag.toLowerCase().includes(toFind)
        );
      });
    }
    if (!target) target = message.member;
    return target;
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
function shuffle(a) {
  try {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("en-US").format(date);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function duration(ms) {
  const sec = Math.floor((ms / 1000) % 60).toString();
  const min = Math.floor((ms / (60 * 1000)) % 60).toString();
  const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
  const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
  return `${days}Days,${hrs}Hours,${min}Minutes,${sec}Seconds`;
}

function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

//randomnumber between 0 and x
function getRandomInt(max) {
  try {
    return Math.floor(Math.random() * Math.floor(max));
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
//random number between y and x
function getRandomNum(min, max) {
  try {
    return Math.floor(Math.random() * Math.floor(max - min + min));
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
function format(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    else
      return (
        (h < 10 ? "0" : "") +
        h +
        ":" +
        (m < 10 ? "0" : "") +
        m +
        ":" +
        (s < 10 ? "0" : "") +
        s
      );
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
function arrayMove(array, from, to) {
  try {
    array = [...array];
    const startIndex = from < 0 ? array.length + from : from;
    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;
      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
async function promptMessage(message, author, time, validReactions) {
  try {
    time *= 1000;
    for (const reaction of validReactions) await message.react(reaction);
    const filter = (reaction, user) =>
      validReactions.includes(reaction.emoji.name) && user.id === author.id;
    return message
      .awaitReactions(filter, {
        max: 1,
        time: time,
      })
      .then((collected) => collected.first() && collected.first().emoji.name);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
