module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "component",
      {
        style: false,
        camel2Dash: false,
        libraryName: "lodash",
        libDir: "",
      },
      "lodash",
    ],
  ],
};
