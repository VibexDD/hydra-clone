const { BaseCluster } = require("kurasuta");
const config = require("../config.json");

module.exports = class extends BaseCluster {
  launch() {
    return this.client.start();
  }
};
