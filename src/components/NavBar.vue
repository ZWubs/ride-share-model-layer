<template>
  <v-app-bar app dark color="primary">
    <v-btn v-bind:to="{name: 'home-page'}">
      Home
    </v-btn>

    <v-btn v-bind:to="{name: 'authorization-page'}">
      Authorize
    </v-btn>

    <v-btn v-bind:to="{name: 'add-vehicle-page'}">
      Add Vehicle
    </v-btn>

    <v-btn v-bind:to="{name: 'add-vehicle-type-page'}">
      Add Vehicle Type
    </v-btn>

    <v-btn v-if="isLoggedIn && isAdministrator" v-bind:to="{name: 'add-ride-page'}">
      Add Ride
    </v-btn>

    <v-btn v-if="isLoggedIn && isAdministrator" v-bind:to="{name: 'update-ride-page'}">
      Update Ride
    </v-btn>

    <v-btn v-if="isLoggedIn && isPassenger" v-bind:to="{name: 'ride-signup-page'}">
      Ride Signup
    </v-btn>

    <v-btn v-if="isLoggedIn && isDriver" v-bind:to="{name: 'driver-report-page'}">
      Driver Reports
    </v-btn>
  </v-app-bar>
</template>
