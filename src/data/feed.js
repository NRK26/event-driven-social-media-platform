const { getRedisClient } = require('../config/redis');

const addToFeed = async (userId, post) => {
  const client = getRedisClient();

  const key = `feed:${userId}`;

  await client.lPush(key, JSON.stringify(post));

  // keep only latest 50 posts
  await client.lTrim(key, 0, 49);
};

const getFeed = async (userId) => {
  const client = getRedisClient();

  const key = `feed:${userId}`;

  const posts = await client.lRange(key, 0, -1);

  return posts.map((p) => JSON.parse(p));
};

module.exports = {
  addToFeed,
  getFeed,
};