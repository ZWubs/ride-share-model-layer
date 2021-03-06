import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import RideReport from "./pages/RideReport";
import AddVehicle from "./pages/AddVehicle.vue";
import AddVehicleType from "./pages/AddVehicleType.vue";
import Authorization from "./pages/Authorization.vue";
import AddRide from "./pages/AddRide.vue";
import UpdateRide from "./pages/UpdateRide.vue";
import DriverReport from "./pages/DriverReports.vue";
import DriverSignUp from "./pages/DriverSignUp";
import PassengerRides from "./pages/PassengerRides";
import Accounts from "./pages/Accounts.vue";
import SignUp from "./pages/SignUp.vue";
import DriverRides from "./pages/DriverRides";
import PassengerSignUp from "./pages/PassengerSignUp";


Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "authorization-page", path: "/authorization", component: Authorization},
    { name: "ride-report-page", path: "/ride-report", component: RideReport},
    { name: "add-vehicle-page", path: "/addvehicle", component: AddVehicle },
    { name: "add-vehicle-type-page", path: "/addvehicletype", component: AddVehicleType },
    { name: "driver-signup-page", path:"/driver-signup", component:DriverSignUp},
    { name: "passenger-signup-page", path:"/passenger-signup", component:PassengerSignUp},
    { name: "driver-rides-page", path: "/driver-rides", component: DriverRides },
    { name: "passenger-rides-page", path:"/passenger-rides", component: PassengerRides},
    { name: "authorization-page", path: "/authorization", component: Authorization},
    { name: "add-ride-page", path: "/addRide", component: AddRide },
    { name: "update-ride-page", path: "/updateRide", component: UpdateRide },
    { name: "driver-report-page", path: "/driverReport", component: DriverReport },
    { name: "accounts-page", path: "/accounts", "component": Accounts },
    { name: "sign-up-page", path: "/signup", "component": SignUp },

  ]
});
