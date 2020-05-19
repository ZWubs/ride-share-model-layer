<template>
  <v-container>
    <div>
      <h4 class="display-1">Let us help you find a ride!</h4>

      <p class="body-1">This is our award-winning home page.</p>

      <v-text-field label="What snack?" v-model="snackText" />
      <v-btn class="primary" @click="snackBar">Test snack</v-btn>

    </div>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'

export default {

  data () {
    return { snackText: '' }
  },

  methods: {

    snackBar: function( ) {

      this.setSnack( this.snackText )

    },
    ...mapMutations({
      setSnack: 'setSnack'
    })

  }

}

</script>
