import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';
class DBClient {
    constructor() {
        const client = MongoClient.connect(`mongodb://${host}:${port}`, { useUnifiedTopology: true });
    }

     isAlive() {
        try {
            this.client.connect();
            return true;
        } catch (err) {
            return false;
        }
    }

    async nbUsers() {
        const db = this.client.db(dbName);
        const collection = db.collection('users');
        const userCount = await collection.countDocuments({});
        return userCount;
    }

    async nbFiles() {
        const db = this.client.db(dbName);
        const collection = db.collection('files');
        const fileCount = await collection.countDocuments({});
        return fileCount;
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
