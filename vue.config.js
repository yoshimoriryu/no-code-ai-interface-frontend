const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Remove /api prefix when forwarding
      },
    },
  },
  // chainWebpack: config => {
  //   config.module
  //     .rule('css')
  //     .test(/\.css$/)
  //     .use('vue-style-loader')
  //     .loader('vue-style-loader')
  //     .end()
  //     .use('css-loader')
  //     .loader('css-loader')
  //     .end()
  // }
};
