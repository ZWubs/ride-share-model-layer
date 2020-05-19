<template>
  <v-app-bar app dark color="primary">
      <v-btn color="info" v-bind:to="{name: 'home-page'}">
          Home
      </v-btn>

      <v-btn color="info" v-if="isLoggedIn && isAdministrator" v-bind:to="{name: 'authorization-page'}">
          Authorize
      </v-btn>

      <v-btn color="info" v-if="isLoggedIn && isAdministrator" v-bind:to="{name: 'add-vehicle-type-page'}">
          Add Vehicle Type
      </v-btn>

      <v-btn color="info" v-if="isLoggedIn && isAdministrator" v-bind:to="{name: 'ride-report-page'}">
          View Rides
      </v-btn>

      <v-btn color = "info" v-if="isLoggedIn && isAdministrator" v-bind:to="{name: 'add-ride-page'}">
          Add Ride
      </v-btn>

      <v-btn color = "info" v-if="isLoggedIn && isAdministrator" v-bind:to="{name: 'update-ride-page'}">
          Update Ride
      </v-btn>

      <v-btn color="info" v-if="isLoggedIn && isDriver" v-bind:to="{name: 'driver-signup-page'}">
          Sign and Drive
      </v-btn>
      <v-btn color="info" v-if="isLoggedIn && (isDriver || isAdministrator)" v-bind:to="{name: 'add-vehicle-page'}">
          Add Vehicle
      </v-btn>

      <v-btn color="info" v-if="isLoggedIn && isDriver" v-bind:to="{name: 'driver-rides-page'}">
          Upcoming Rides
      </v-btn>

      <v-btn color="info" v-if="isLoggedIn && isPassenger" v-bind:to="{name: 'passenger-rides-page'}">
          Upcoming Rides
      </v-btn>

      <v-btn color="info" v-if="isLoggedIn && isPassenger" v-bind:to="{name: 'passenger-signup-page'}">
          Get a Ride
      </v-btn>

      <v-btn color="info" v-if="isLoggedIn && isAdministrator" v-bind:to="{name: 'accounts-page'}">
          Accounts
      </v-btn>

      <v-spacer></v-spacer>

    <v-menu v-if="isLoggedIn" offset-y transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn text large v-on="on">
          <v-avatar v-on="on" size="36" color="accent">
            <span>{{accountInitials}}</span>
          </v-avatar>
          <v-icon dark>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item @click="signOut">
          <v-list-item-title>Sign Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <template v-else offset-y>
      <v-btn text @click="signUp">
        Sign Up
      </v-btn>
      <v-btn text @click="signIn">
        Sign In
      </v-btn>
    </template>

	</v-app-bar>
</template>

<script>
export default {

  data: function() {
    return {
      accountProfile: "AZ"
    }
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    isPassenger() {
      return this.$store.getters.isPassenger;
    },
    isDriver() {
      return this.$store.getters.isDriver;
    },
    isAdministrator() {
      return this.$store.getters.isAdministrator;
    },
    accountInitials() {
      return this.$store.getters.accountInitials;
    }
  },

  methods: {
    signOut() {
      this.$store.commit("logOut");
      if (this.$router.currentRoute.name != "home-page") {
        this.$router.push({ name: "home-page" });
      }
    },
    signIn() {
      if (this.$router.currentRoute.name != "accounts-page") {
        this.$router.push({ name: "accounts-page" });
      }
    },
    signUp() {
      if (this.$router.currentRoute.name != "sign-up-page") {
        this.$router.push({ name: "sign-up-page" });
      }
    }
  }
};
</script>
