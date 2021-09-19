const path = require("path");
const assetsPath = path.resolve(__dirname, `./src/assets`);

const assetsName = "netease";
module.exports = {
  spritesmithOptions: {
    padding: 1,
  },
  src: {
    cwd: assetsPath,
    glob: ["sprites/**/*.{png,jpg,jpeg}"],
  },
  target: {
    image: `${assetsPath}/_spritesmith/${assetsName}.png`,
    css: [
      [
        `${assetsPath}/_spritesmith/${assetsName}.scss`,
        {
          format: "handlebars_based_template",
        },
      ],
    ],
  },

  customTemplates: {
    handlebars_based_template: path.resolve(
      __dirname,
      "./scss.template.handlebars"
    ),
  },

  apiOptions: {
    cssImageRef: `~@/assets/_spritesmith/${assetsName}.png`,
    spritesheet_info: {
      name: assetsName + "-spritesheet",
    },
    generateSpriteName: (fileName) => {
      return "sprite_" + path.parse(path.relative(assetsPath, fileName)).name;
    },
  },
};
