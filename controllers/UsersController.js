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
    try {
      const collection = dbClient.db.collection('users');
      collection.insertOne({ email, password: hashed });
      const User = await collection.findOne(
          { email }, { projection: { email: 1 } }
        );
        response.status(201).json({ id: User._id, email: User.email });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Server error' });
    }
}
module.exports = UsersController;
