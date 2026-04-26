const { createClient } = require('redis');

let client;

const connectRedis = async () => {
  client = createClient({
    url: 'redis://localhost:6379',
  });

  client.on('error', (err) => console.error('Redis Error:', err));

  await client.connect();
  console.log(' Redis connected');
};

const getRedisClient = () => {
  return client;
};

module.exports = {
  connectRedis,
  getRedisClient,
};