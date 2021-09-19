import "swiper/css/swiper.css";
import context, { Events } from "./context";
import Vue from "vue";
import router from "./router";
import App from "./App";
import VueTouch from "vue-touch";
import { Promised } from "vue-promised";
import NetEaseServices from "./services";
Vue.config.productionTip = false;
Vue.component("promised", Promised);
Vue.use(VueTouch, { name: "v-touch" });
Vue.prototype.$state = Vue.observable(context.state);

context.services = new NetEaseServices(
  "https://netease-cloud-music-api-green-omega.vercel.app/"
);
context.browsers.on("resize", () => {
  context.state.resizeCount++;
});

context.events.once(Events.Loaded, () => {
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
});
