export interface Resources {
  images: { [key: string]: Resource };
}

export interface Resource {
  src: string;
  target?: any; //资源下载完毕后的句柄
}

const resources: Resources = {
  images: {
    sprites: {
      src: require("@/assets/_spritesmith/netease.png"),
    },
  },
};

export default resources;
