const bcrypt = require('bcrypt');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(res, req) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).send('Missing email');
    }
    if (!password) {
      res.status(400).send('Missing password');
    }
    const alreadyExist = await dbClient.collection('users').findOne({ email });
    if (alreadyExist) {
      res.status(400).send('Already exist');
    }
    const salt = bcrypt.genSalt(10);
    const hashed = bcrypt.hash(password, salt);
    const inserted = await dbClient.collection('users').insertOne({ email, hashed });
    return res.status(200).json({ id: inserted.insertedId, email });
  }
}
module.exports = UsersController;
