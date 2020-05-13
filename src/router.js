import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import AddVehicle from "./pages/AddVehicle.vue";
import AddVehicleType from "./pages/AddVehicleType.vue";
import Authorization from "./pages/Authorization.vue";
import Accounts from "./pages/Accounts.vue";
import SignUp from "./pages/SignUp.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "add-vehicle-page", path: "/addvehicle", component: AddVehicle },
    { name: "add-vehicle-type-page", path: "/addvehicletype", component: AddVehicleType },
    { name: "authorization-page", path: "/authorization", component: Authorization},
	{ name: "accounts-page", path: "/accounts", "component": Accounts },
	{ name: "sign-up-page", path: "/signup", "component": SignUp }
  ]
});
