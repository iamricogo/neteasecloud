import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Discovery from "@/views/Discovery";
import Account from "@/views/Account";

export enum Pages {
  Discovery = "discovery",
  Account = "account",
}

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/" + Pages.Discovery,
    name: Pages.Discovery,
    component: Discovery,
  },
  {
    path: "/" + Pages.Account,
    name: Pages.Account,
    component: Account,
  },
  {
    path: "*",
    redirect: {
      name: Pages.Discovery,
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
