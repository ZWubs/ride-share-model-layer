<template>
  <v-app-bar app dark color="primary">
    <v-btn v-bind:to="{name: 'authorization-page'}">
      Authorize
    </v-btn>

    <v-btn v-bind:to="{name: 'add-vehicle-page'}">
      Add Vehicle
    </v-btn>
    
    <v-btn v-bind:to="{name: 'add-vehicle-type-page'}">
      Add Vehicle Type
    </v-btn>
  </v-app-bar>
</template>
