import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import Authorization from "./pages/Authorization";
import RideReport from "./pages/RideReport";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "authorization-page", path: "/authorization", component: Authorization},
    { name: "ride-report-page", path: "/ride-report", component: RideReport},

  ]
});
