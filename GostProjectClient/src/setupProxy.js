const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:7243',
      changeOrigin: true,
      onProxyReq: function(proxyReq) {
        proxyReq.setHeader('Host', 'localhost:7243'); // Устанавливает хост для запроса
      },
    })
  );
};