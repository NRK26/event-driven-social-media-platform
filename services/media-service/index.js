const express = require("express");
const app = express();
const PORT = 3005;

app.get("/", (req, res) => res.send("Media Service"));

app.listen(PORT, () => {
  console.log(`Media Service running on ${PORT}`);
});