const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "social-app",
  brokers: ["localhost:9092"], 
});

module.exports = kafka;