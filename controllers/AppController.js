import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(request, response) {
    const json = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).send(json);
  }

  static async getStats(request, response) {
    const json = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    response.status(200).send(json);
  }
}
module.exports = AppController;
