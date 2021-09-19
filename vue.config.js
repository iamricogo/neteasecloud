module.exports = {
  publicPath: "",
  devServer: {
    inline: true,
    hot: true,
    host: "0.0.0.0",
    useLocalIp: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      ...["/api"].reduce((pre, cur) => {
        pre[cur] = {
          target: "https://netease-cloud-music-api-green-omega.vercel.app/",
          changeOrigin: true,
          pathRewrite: {
            [cur]: "",
          },
        };
        return pre;
      }, {}),
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
                @import "~@/styles/_var.scss";
                @import "~@/assets/_spritesmith/netease.scss";
                @import "~@/styles/_mixins.scss";
                `,
      },
    },
  },
  transpileDependencies: [/swiper/, /dom7/, /strip-ansi/], //IE11兼容，正则匹配强制走babel转换

  chainWebpack: (config) => {
    //合图插件
    config
      .plugin("sprites")
      .use(require("webpack-spritesmith"), [require("./sprites.config")]);

    //调试插件
    config.plugin("eruds").use(require("eruda-webpack-plugin"), [
      {
        entry: /app\.js$/,
      },
    ]);

    config.module.rule("css-modules-typescript").test(/\.js$/);
  },
};
