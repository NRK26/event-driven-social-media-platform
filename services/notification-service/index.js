const express = require("express");
const app = express();
const PORT = 3004;

app.get("/", (req, res) => res.send("Notification Service"));

app.listen(PORT, () => {
  console.log(`Notification Service running on ${PORT}`);
});