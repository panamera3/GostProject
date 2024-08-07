"use strict";

var _require = require("http-proxy-middleware"),
  createProxyMiddleware = _require.createProxyMiddleware;

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5175/api",
      changeOrigin: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  );
};
