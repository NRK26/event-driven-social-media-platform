
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME,
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  ssl: false,
});

async function subscribe(groupId, topics, handler) {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        await handler(event, { topic, partition });
      } catch (err) {
        console.error(`[Kafka] Failed to process on ${topic}:`, err.message);
      }
    },
  });

  console.log(`[Kafka] Consumer "${groupId}" listening on [${topics.join(", ")}]`);
}

module.exports = { subscribe };