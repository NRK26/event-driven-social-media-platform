require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//  Register
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3) RETURNING id",
      [username, email, hash]
    );

    res.status(201).json({ userId: rows[0].id });
 } catch (err) {
  console.error("REGISTER ERROR:", err);
  res.status(500).json({ error: err.message || "unknown error" });
}
});

//  Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { rows } = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, userId: user.id });
  } catch (err) {
  console.error("REGISTER ERROR:", err);
  res.status(500).json({ error: err.message || "unknown error" });
}
});

app.listen(3001, () => {
  console.log("User Service running on :3001");
});