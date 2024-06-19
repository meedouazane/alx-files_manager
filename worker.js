import DBClient from './utils/db';
import Bull from 'bull';
import { ObjectId } from 'mongodb';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs/promises';

const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

const createImageThumbnail = async (path, options) => {
  try {
    const thumbnail = await imageThumbnail(path, options);
    const pathNail = `${path}_${options.width}`;
    await fs.writeFile(pathNail, thumbnail);
  } catch (error) {
    console.error(`Error creating thumbnail: ${error.message}`);
    throw error;
  }
};

fileQueue.process(async (job) => {
  try {
    const { fileId, userId } = job.data;

    if (!fileId) throw new Error('Missing fileId');
    if (!userId) throw new Error('Missing userId');

    const fileDocument = await DBClient.db.collection('files').findOne({
      _id: new ObjectId(fileId),
      userId: new ObjectId(userId),
    });

    if (!fileDocument) throw new Error('File not found');

    await Promise.all([
      createImageThumbnail(fileDocument.localPath, { width: 500 }),
      createImageThumbnail(fileDocument.localPath, { width: 250 }),
      createImageThumbnail(fileDocument.localPath, { width: 100 }),
    ]);

  } catch (error) {
    console.error(`Error processing fileQueue job: ${error.message}`);
    throw error;
  }
});

userQueue.process(async (job) => {
  try {
    const { userId } = job.data;

    if (!userId) throw new Error('Missing userId');

    const userDocument = await DBClient.db.collection('users').findOne({
      _id: new ObjectId(userId),
    });

    if (!userDocument) throw new Error('User not found');

    console.log(`Welcome ${userDocument.email}`);
  } catch (error) {
    console.error(`Error processing userQueue job: ${error.message}`);
    throw error;
  }
});
