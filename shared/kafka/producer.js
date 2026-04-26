
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "social-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();

let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    console.log("Kafka Producer connected");
    isConnected = true;
  }
};

const publish = async (topic, message, key = null) => {
  await connectProducer();

  await producer.send({
    topic,
    messages: [
      {
        key: key || null,
        value: JSON.stringify(message),
      },
    ],
  });

  console.log(`Event published to ${topic}`);
};

module.exports = { publish };