<template>
  <v-container>
    <div>
      <h4 class="display-1">Let us help you find a ride!</h4>

      <p class="body-1">This is our award-winning home page.</p>

      <p>{{ $store.state.currentAccount.firstName }}</p>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "HomePage",
  data: function () {
    return {
      accountName: "",
	};
  },

  mounted: async function() {},

  methods: {

  },
};

</script>
