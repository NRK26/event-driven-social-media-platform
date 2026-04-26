const { runConsumer } = require('./kafka/consumer');
const { connectRedis } = require('./config/redis');

const start = async () => {
  await connectRedis();
  await runConsumer();
};

start();

