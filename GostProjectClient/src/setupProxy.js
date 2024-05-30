const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5244/api",
      changeOrigin: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  );
};
