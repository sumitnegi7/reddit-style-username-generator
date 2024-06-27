import { HydrateUsernamesInRedis } from '../../dist/index.js';

// Redis client configuration
const redisOptions = {
  host: 'localhost',
  port: 6379,
};

// Example usage function
async function main() {
  const generator = new HydrateUsernamesInRedis(redisOptions);
  const filePath = './combinations.txt';
  const redisKey = 'available:usernames';

  try {
    await generator.storeUsernamesFromFile(filePath, redisKey);
  } catch (error) {
    console.error('Error storing usernames:', error);
  }
}

// Run the main function
main();
