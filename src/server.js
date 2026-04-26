const express = require('express');
const { connectProducer, sendPostEvent } = require('./kafka/producer');
const { getFeed } = require('./data/feed');
const { connectRedis } = require('./config/redis');
const { connectDB } = require('./config/postgres');   //  NEW
const { createPost } = require('./data/post');        //  NEW

const app = express();
const PORT = 4000;

app.use(express.json());

//  CONNECT ALL SERVICES
(async () => {
  await connectRedis();
  await connectProducer();
  await connectDB();
})();


// CREATE POST API
app.post('/create-post', async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'userId and content required' });
    }

    const post = {
      postId: Date.now(),
      userId,
      content,
      timestamp: Date.now(),
    };

    //  STEP 1: SAVE TO POSTGRES
    await createPost(post);

    //  STEP 2: SEND TO KAFKA
    await sendPostEvent(post);

    res.json({
      message: 'Post created successfully',
      post,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// GET FEED API
app.get('/feed/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const feed = await getFeed(userId);

    res.json({
      userId,
      feed,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


