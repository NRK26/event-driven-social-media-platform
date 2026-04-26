const { pool } = require('../config/postgres');

const createPost = async (post) => {
  await pool.query(
    'INSERT INTO posts (post_id, user_id, content, created_at) VALUES ($1,$2,$3,$4)',
    [post.postId, post.userId, post.content, post.timestamp]
  );
};

module.exports = { createPost };