const { connectRedis } = require('./config/redis');
const { getFeed } = require('./data/feed');

const userId = process.argv[2];

const run = async () => {
  await connectRedis(); // IMPORTANT

  const feed = await getFeed(userId);

  console.log(`\n Feed for user ${userId}:`);
  console.log(feed);

  process.exit();
};

run();