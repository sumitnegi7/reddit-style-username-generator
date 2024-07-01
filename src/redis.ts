import * as fs from 'fs';
import { generateCombinationsToFile } from './generateCombinationsToFile';

class HydrateUsernamesInRedis {
  private redis: any;
  private clientType: string;

  constructor(redisInstance: any) {
    this.clientType = this.detectRedisClient(redisInstance);

    if (this.clientType === 'ioredis') {
      this.redis = redisInstance;
    } else if (this.clientType === 'node-redis') {
      this.redis = redisInstance;
    } else {
      throw new Error('Unknown Redis client type');
    }
  }

  private detectRedisClient(client: any): string {
    if (client && typeof client === 'object') {
      if (typeof client.sadd === 'function') {
        return 'ioredis';
      } else if (typeof client.sAdd === 'function') {
        return 'node-redis';
      }
    }
    return 'unknown';
  }

  async storeUsernamesFromFile(
    redisKey: string,
    batchSize: number = 100,
  ): Promise<void> {
    const filePath = './combinations.txt';
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
      const outputFilePath = filePath;
      const randomRange = [1, 2, 3, 4];

      // Generate combinations to file using function
      await generateCombinationsToFile(outputFilePath, randomRange);

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
        this.clientType === 'ioredis'
          ? await this.redis.sadd(redisKey, ...usernames)
          : await this.redis.SADD(redisKey, ...usernames);
        console.log(
          `Stored ${usernames.length} usernames in Redis set "${redisKey}".`,
        );
      } catch (error) {
        console.error('Error adding usernames to Redis:', error);
      }
    }
  }

  async getRandomUsernameFromRedis(
    redisKey: string,
    removeSelectedUsername = false,
  ) {
    try {
      const username =
        this.clientType === 'ioredis'
          ? await this.redis.srandmember(redisKey)
          : await this.redis.SRANDMEMBER(redisKey);

      if (removeSelectedUsername) {
        this.clientType === 'ioredis'
          ? await this.redis.srem(redisKey, username)
          : await this.redis.SREM(redisKey, username);
      }

      return username;
    } catch (error) {
      console.error('Error accessing Redis:', error);
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
