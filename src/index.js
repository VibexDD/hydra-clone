const HydraClient = require("./Structures/HydraClient");
const config = require("../config.json");
const client = new HydraClient(config);

client.start();
