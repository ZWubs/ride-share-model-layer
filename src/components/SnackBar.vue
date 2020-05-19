<template>
  <v-snackbar v-model="show">
    {{message}}
    <v-btn
      text
      color="pink"
      @click.native="show = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: ''
    }
  },
  created: function () {
    this.$store.watch(state => state.snackbarText, () => {
      const msg = this.$store.state.snackbarText
      if (msg !== '') {
        this.show = true;
        this.message = this.$store.state.snackbarText;
        this.$store.commit('setSnack', '');
      }
    })
  }
}
</script>
