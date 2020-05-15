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

	<v-btn v-bind:to="{name: 'accounts-page'}">
      Accounts
    </v-btn>

	<v-spacer></v-spacer>

	<v-btn v-if="!isLoggedIn" v-bind:to="{name: 'sign-up-page'}">
      Sign Up
    </v-btn>
  </v-app-bar>
</template>
