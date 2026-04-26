
require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");
const { subscribe } = require("../../shared/kafka/consumer");

const app = express();
const redis = new Redis(process.env.REDIS_URL);

console.log(" Starting Feed Service...");

//  Subscribe to post-events
subscribe("feed-group", ["post-events"], async (event) => {
  console.log(" Event received:", event);

  if (event.type === "POST_CREATED") {
    const { postId, authorId, content } = event.payload;

    // Store in Redis feed
    await redis.lpush(
      `feed:${authorId}`,
      JSON.stringify({
        postId,
        content,
        createdAt: new Date(),
      })
    );
  }
});

// GET FEED
app.get("/:userId", async (req, res) => {
  const feed = await redis.lrange(`feed:${req.params.userId}`, 0, 10);
  res.json(feed.map(JSON.parse));
});

app.listen(3003, () => {
  console.log("Feed Service running on 3003");
});