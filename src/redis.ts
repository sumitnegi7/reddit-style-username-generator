import * as fs from 'fs';
import Redis, { RedisOptions } from 'ioredis';
import { generateCombinationsToFile } from './generateCombinationsToFile';

class HydrateUsernamesInRedis {
  private redis: Redis;

  constructor(redisOptions: RedisOptions) {
    this.redis = new Redis(redisOptions);
  }

  async storeUsernamesFromFile(
    filePath: string,
    redisKey: string,
    batchSize: number = 100,
  ): Promise<void> {
    try {
      await this.generateAndStoreCombinations(filePath, redisKey);
      console.log(
        `Stored all usernames from file ${filePath} in Redis set "${redisKey}".`,
      );
    } catch (error) {
      console.error('Error storing usernames:', error);
    } finally {
      await this.quitRedis();
    }
  }

  async generateAndStoreCombinations(
    filePath: string,
    redisKey: string,
  ): Promise<void> {
    try {
      const outputFilePath = './combinations.txt'; // Adjust the output file path as needed
      const colors = ['Red', 'Blue', 'Green']; // Example colors array
      const nouns = ['Apple', 'Banana', 'Orange']; // Example nouns array
      const randomRange = [1, 2, 3, 4]; // Example range array

      // Generate combinations to file using function
      await generateCombinationsToFile(
        colors,
        nouns,
        outputFilePath,
        randomRange,
      );

      // Read combinations from file using streams and store in Redis
      await this.readAndStoreUsernamesFromStream(filePath, redisKey);
    } catch (error) {
      console.error('Error generating and storing combinations:', error);
      await this.quitRedis();
    }
  }

  async readAndStoreUsernamesFromStream(
    filePath: string,
    redisKey: string,
  ): Promise<void> {
    const readableStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let buffer = '';

    readableStream.on('data', async (chunk) => {
      buffer += chunk;
      if (buffer.includes('\n')) {
        const lines = buffer.split('\n');
        buffer = lines.pop() as string; // Save incomplete line for next chunk

        const usernames = lines.flatMap((line) => line.trim().split(','));
        await this.addUsernamesToRedis(redisKey, usernames);
      }
    });

    readableStream.on('end', async () => {
      if (buffer) {
        const usernames = buffer.trim().split(',');
        await this.addUsernamesToRedis(redisKey, usernames);
      }
      console.log(
        `Stored all usernames from file ${filePath} in Redis set "${redisKey}".`,
      );
      await this.quitRedis();
    });

    readableStream.on('error', (error) => {
      console.error(`Error reading file ${filePath}: ${error.message}`);
      this.quitRedis();
    });
  }

  async addUsernamesToRedis(
    redisKey: string,
    usernames: string[],
  ): Promise<void> {
    if (usernames.length > 0) {
      try {
        await this.redis.sadd(redisKey, ...usernames);
        console.log(
          `Stored ${usernames.length} usernames in Redis set "${redisKey}".`,
        );
      } catch (error) {
        console.error('Error adding usernames to Redis:', error);
      }
    }
  }

  async quitRedis(): Promise<void> {
    try {
      // await this.redis.quit();
      console.log('Redis connection closed.');
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
}

export default HydrateUsernamesInRedis;
