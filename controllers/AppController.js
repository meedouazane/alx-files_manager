const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static getStatus(req, res) {
    const isDbAlive = dbClient.isAlive();
    const isRedisAlive = redisClient.isAlive();
    res.status(200).send({ redis: isRedisAlive, db: isDbAlive });
  }

  static async getStats(req, res) {
    const nbUsers = await dbClient.nbUsers();
    const nbFiles = await dbClient.nbFiles();
    res.status(200).send({ users: nbUsers, files: nbFiles });
  }
}

module.exports = AppController;
