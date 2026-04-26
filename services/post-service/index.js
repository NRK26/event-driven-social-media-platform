require("dotenv").config();
const express = require("express");
const { v4: uuid } = require("uuid");
const { Pool } = require("pg");
const { publish } = require("../../shared/kafka/producer");
const { EventFactory } = require("../../shared/events");

const app = express();
app.use(express.json());

const db = new Pool({ connectionString: process.env.DATABASE_URL });

console.log(" Starting Post Service...");
console.log("KAFKA:", process.env.KAFKA_BROKER);

// CREATE POST
app.post("/", async (req, res) => {
  try {
    const authorId = req.headers["x-user-id"];
    const { content } = req.body;

    const postId = uuid();

    await db.query(
      "INSERT INTO posts (id, author_id, content, created_at) VALUES ($1,$2,$3,NOW())",
      [postId, authorId, content]
    );

    const event = EventFactory.postCreated(postId, authorId, content);

    try {
      await publish("post-events", event, postId);
    } catch (e) {
      console.error("Kafka error:", e.message);
    }

    res.json({ postId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Post Service");
});

app.listen(3002, () => {
  console.log(" Post Service running on 3002");
});