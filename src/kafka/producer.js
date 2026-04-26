const kafka = require('../config/kafka');

let producer;
let isConnected = false;

const connectProducer = async () => {
  if (!producer) {
    producer = kafka.producer();
  }

  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log('Producer connected');
  }
};

const sendPostEvent = async (post) => {
  console.log(' FUNCTION ENTERED');

  if (!producer || !isConnected) {
    throw new Error('Producer not connected');
  }

  await producer.send({
    topic: 'post_created',
    messages: [
      {
        key: String(post.postId), //  IMPORTANT (dedup at Kafka level)
        value: JSON.stringify(post),
      },
    ],
    acks: 1, //  prevents duplicate retries
  });

  console.log(' Post created event sent:', post);
};

module.exports = {
  connectProducer,
  sendPostEvent,
};