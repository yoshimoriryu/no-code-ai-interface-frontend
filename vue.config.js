const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    // https: true, // Ensure that Webpack Dev Server runs with HTTPS
    // client: {
    //   webSocketURL: 'wss://localhost:8080/ws', // Use secure WebSocket URL
    // },
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
}