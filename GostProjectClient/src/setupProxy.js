const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5175/api",
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        const token = localStorage.getItem("token");
        proxyReq.setHeader("Authorization", `Bearer ${token}`);
      },
    })
  );
};
