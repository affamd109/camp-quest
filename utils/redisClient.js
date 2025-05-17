const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis when my app starts
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch(console.error);

module.exports = redisClient;
