const kafka = require('../config/kafka');

const consumer = kafka.consumer({
  groupId: 'feed-group-' + Date.now(),
});

const runConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'post_created',
    fromBeginning: false,
  });

  console.log('Feed service started (consumer)');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        console.log(' New Post Event Received:');
        console.log(data);

        const followers = require('../data/followers');
        const { addToFeed } = require('../data/feed');
        const { getRedisClient } = require('../config/redis');

        const client = getRedisClient();

        //  DEDUP KEY
        const dedupKey = `post:${data.postId}`;

        const exists = await client.get(dedupKey);
        if (exists) {
          console.log(' Duplicate event skipped');
          return;
        }

        await client.set(dedupKey, '1');

        const userFollowers = followers[data.userId] || [];

        console.log(` Fan-out to followers: ${userFollowers}`);

        for (const followerId of userFollowers) {
          await addToFeed(followerId, data);
        }

        console.log(' Feed updated in Redis');

      } catch (err) {
        console.error(' Error processing message:', err);
      }
    },
  });
};


//  THIS WAS MISSING
module.exports = {
  runConsumer,
};