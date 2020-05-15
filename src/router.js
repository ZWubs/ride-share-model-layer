import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import AddVehicle from "./pages/AddVehicle.vue";
import AddVehicleType from "./pages/AddVehicleType.vue";
import Authorization from "./pages/Authorization.vue";
import AddRide from "./pages/AddRide.vue";
import UpdateRide from "./pages/UpdateRide.vue";
import RideSignup from "./pages/RideSignup.vue";
import DriverReport from "./pages/DriverReports.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "add-vehicle-page", path: "/addvehicle", component: AddVehicle },
    { name: "add-vehicle-type-page", path: "/addvehicletype", component: AddVehicleType },
    { name: "authorization-page", path: "/authorization", component: Authorization},
    { name: "add-ride-page", path: "/addRide", component: AddRide },
    { name: "update-ride-page", path: "/updateRide", component: UpdateRide },
    { name: "ride-signup-page", path: "/rideSignup", component: RideSignup },
    { name: "driver-report-page", path: "/driverReport", component: DriverReport },
    /*{ name: "", path: "", component: },*/
  ]
});
