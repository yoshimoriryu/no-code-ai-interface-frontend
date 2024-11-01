const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
    https: true,
    webSocketServer: {
      type: 'ws'
    },
    allowedHosts: 'all',
    client: {
      webSocketURL: {
        protocol: 'wss'  // Use WSS protocol for secure WebSocket
      }
    },
  },
});
