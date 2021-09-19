module.exports = {
  plugins: {
    "postcss-px2rem-exclude": {
      remUnit: 100,
      exclude: /_adapter/,
    },
  },
};
