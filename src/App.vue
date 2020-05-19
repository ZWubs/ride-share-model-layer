<template>
  <v-app>
    <snack-bar />
    <nav-bar />
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import SnackBar from "./components/SnackBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
    SnackBar
  },
};
</script>
