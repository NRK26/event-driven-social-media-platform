const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3000;

// Routes → services
app.use("/v1/users", createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return path; 
  }
}));
app.use("/v1/posts", createProxyMiddleware({ target: "http://localhost:3002", changeOrigin: true }));
app.use("/v1/feed", createProxyMiddleware({ target: "http://localhost:3003", changeOrigin: true }));
app.use("/v1/notifications", createProxyMiddleware({ target: "http://localhost:3004", changeOrigin: true }));
app.use("/v1/media", createProxyMiddleware({ target: "http://localhost:3005", changeOrigin: true }));
app.get("/", (req, res) => {
  res.send("API Gateway running");
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
