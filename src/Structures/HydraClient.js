const { Client, Collection, Permissions, Intents } = require("discord.js");
const config = require("../../config.json");
const Util = require("./Util.js");
const { Shoukaku } = require("shoukaku");
const mains = ["#1a9cb6", "#95a5a5"];
const LavalinkServer = config.nodes;
const { LavasfyClient } = require("lavasfy");
const functions = require("../utils/functions");
const ShoukakuOptions = { moveOnDisconnect: false, resumable: false, resumableTimeout: 30, reconnectTries: 2, restTimeout: 10000 };
const SoundCloud = require("soundcloud-scraper");
const Queue = require("../modules/Queue.js");
const mongoose = require("mongoose");
const fs = require("fs");

module.exports = class HydraClient extends Client {
  constructor(options = {}) {
    super({
      shards: "auto",
      restTimeOffset: 0,
      partials: ["MESSAGE", "CHANNEL", "REACTION"],
      disableMentions: "everyone",
    });

    this.validate(options);
    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();
    this.utils = new Util(this);
    this.formatDuration = require("../utils/formatDuration");
    this.soundcloud = new SoundCloud.Client(options.SOUNDCLOUD_API_KEY);
    this.config = options;
    this.functions = functions;
    this.owners = options.owners;
    this.shoukaku = new Shoukaku(this, LavalinkServer, ShoukakuOptions);
    this.queue = new Queue(this);
    this.guildsData = require("./Guild");
    this.databaseCache = {};
    this.colors = require("../colors");
    this.databaseCache.guilds = new Collection();
    this.logger = require("../modules/Logger.js");
    this.wait = require("util").promisify(setTimeout);
    this.play = require("../utils/play.js");
    this.lavasfy = new LavasfyClient(
      {
        clientID: config.SPOTIFY_ID,
        clientSecret: config.SPOTIFY_SECRET,
        playlistLoadLimit: config.SPOTIFY_PLAYLIST_PAGE_LIMIT,
        autoResolve: true,
        audioOnlyResults: true,
        useSpotifyMetadata: true,
      },
      config.nodes.map((x) => ({
        url: `${x.host}:${x.port}`,
        auth: x.auth,
        name: x.name,
      }))
    );
    this.color = {
      main: mains[Math.floor(Math.random() * mains.length)],
      error: "#ffb232",
    };
    ["beforeExit", "SIGUSR1", "SIGUSR2", "SIGINT", "SIGTERM"].map((event) =>
      process.once(event, this.exit.bind(this))
    );
  }

  startup() {
    mongoose
      .connect(this.config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((mon) => this.logger.log(`Connected to the database!`, "log"))
      .catch((err) => console.log( "Unable to connect to the Mongodb database. Error:" + err, "error"));

    fs.readdir("./src/listeners", (err, files) => {
      if (err) return console.error(err);
      files.forEach((file) => {
        const event = require(`../listeners/${file}`);
        let eventName = file.split(".")[0];
        this.on(eventName, event.bind(null, this));
      });
    });
  } 
  exit() {
    if (this.quitting) return;
    this.quitting = true;
    this.destroy();
  }
  validate(options) {
    options.token = process.env.TOKEN;
    options.prefix = process.env.PREFIX;
    if (typeof options !== "object")
      throw new TypeError("Options should be a type of Object.");
    if (!options.token)
      throw new Error("You must pass the token for the client.");
    this.token = options.token;
    if (!options.MONGODB_URI)
      throw new Error("You must pass the mongodb uri for the database.");
    if (!options.SOUNDCLOUD_API_KEY)
      throw new Error("You must pass the SOUNDCLOUD_API_KEY .");
    if (!options.SPOTIFY_ID || !options.SPOTIFY_SECRET)
      throw new Error("You must pass the SPOTIFY credentials.");
    if (!options.prefix)
      throw new Error("You must pass a prefix for the client.");
    if (typeof options.prefix !== "string")
      throw new TypeError("Prefix should be a type of String.");
    this.prefix = options.prefix;
    if (!options.defaultPerms)
      throw new Error("You must pass default perm(s) for the Client.");
    this.defaultPerms = new Permissions(options.defaultPerms).freeze();
  }

  async findOrCreateGuild({ id: guildID }, isLean) {
    if (this.databaseCache.guilds.get(guildID)) {
      return isLean
        ? this.databaseCache.guilds.get(guildID).toJSON()
        : this.databaseCache.guilds.get(guildID);
    } else {
      let guildData = isLean
        ? await this.guildsData
            .findOne({ id: guildID })
            .populate("members")
            .lean()
        : await this.guildsData.findOne({ id: guildID }).populate("members");
      if (guildData) {
        if (!isLean) this.databaseCache.guilds.set(guildID, guildData);
        return guildData;
      } else {
        guildData = new this.guildsData({ id: guildID });
        await guildData.save();
        this.databaseCache.guilds.set(guildID, guildData);
        return isLean ? guildData.toJSON() : guildData;
      }
    }
  }

  async resolveUser(search) {
    let user = null;
    if (!search || typeof search !== "string") return;
    if (search.match(/^<@!?(\d+)>$/)) {
      const id = search.match(/^<@!?(\d+)>$/)[1];
      user = this.users.fetch(id).catch(() => {});
      if (user) return user;
    }
    if (search.match(/^!?(\w+)#(\d+)$/)) {
      const username = search.match(/^!?(\w+)#(\d+)$/)[0];
      const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
      user = this.users.find(
        (u) => u.username === username && u.discriminator === discriminator
      );
      if (user) return user;
    }
    user = await this.users.fetch(search).catch(() => {});
    return user;
  }

  _setupShoukakuEvents() {
    this.shoukaku.on("ready", (name) =>
      this.logger.log(`Lavalink ${name}: Ready!`, "log")
    );
    this.shoukaku.on("error", (name, error) =>
      console.error(`Lavalink ${name}: Error Caught,`, error)
    );
    this.shoukaku.on("close", (name, code, reason) =>
      console.warn(
        `Lavalink ${name}: Closed, Code ${code}, Reason ${
          reason || "No reason"
        }`
      )
    );
    this.shoukaku.on("disconnected", (name, reason) =>
      console.warn(
        `Lavalink ${name}: Disconnected, Reason ${reason || "No reason"}`
      )
    );
  }

  async start(token = this.token) {
    this._setupShoukakuEvents();
    this.utils.loadCommands();
    this.utils.loadEvents();
    this.startup();
    await super.login(token);
  }
};
