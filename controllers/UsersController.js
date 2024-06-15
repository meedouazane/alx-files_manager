import sha1 from 'sha1';
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(res, req) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).send({ error: 'Missing email'});
    }
    if (!password) {
      res.status(400).send({error: 'Missing password'});
    }
    const alreadyExist = await dbClient.users.findOne({ email });
    if (alreadyExist) {
      res.status(400).send({ error: 'Already exist' });
    }
    const hashed = sha1(password);
    const inserted = await dbClient.collection('users').insertOne({ email, hashed });
    return res.status(201).json({ id: inserted.insertedId, email });
  }
}
module.exports = UsersController;
