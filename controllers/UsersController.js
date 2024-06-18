import sha1 from 'sha1';
import Queue from 'bull';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const userQueue = new Queue('userQueue');
async function getAuthToken(request) {
  const token = request.headers['x-token'];
  return `auth_${token}`;
}

async function findUserToken(request) {
  const key = await getAuthToken(request);
  const userId = await redisClient.get(key);
  return userId || null;
}

async function findUserId(userId) {
  const userExists = await dbClient.users.find(`ObjectId("${userId}")`).toArray();
  return userExists[0] || null;
}

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      res.status(400).send({ error: 'Missing password' });
    }

    const alreadyExist = await dbClient.users.findOne({ email });
    if (alreadyExist) {
      res.status(400).send({ error: 'Already exist' });
    }

    const sha1Password = sha1(password);
    let insert;
    try {
      insert = await dbClient.users.insertOne({
        email, password: sha1Password,
      });
    } catch (err) {
      await userQueue.add({});
      return res.status(500).send({ error: 'Error creating user' });
    }

    const user = {
      id: insert.insertedId,
      email,
    };
    await userQueue.add({
      userId: insert.insertedId.toString(),
    });
    return res.status(201).send(user);
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = await findUserToken(req);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const user = await findUserId(userId);
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const pUser = { id: user._id, ...user };
    delete pUser._id;
    delete pUser.password;
    return res.status(200).send(pUser);
  }
}

module.exports = UsersController;
