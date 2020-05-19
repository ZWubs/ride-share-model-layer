<template>
  <v-container>
    <div>
      <h4 class="display-1">Account Sign Up</h4>

      <instructions details="Register an account here." />

      <v-form v-model="valid">
        <v-text-field
          v-model="newAccount.firstname"
          label="First Name"
          v-bind:rules="rules.name"
        ></v-text-field>

    <v-text-field
          v-model="newAccount.lastname"
          label="Last Name"
          v-bind:rules="rules.name"
        ></v-text-field>

    <v-text-field
          v-model="newAccount.phone"
          label="Phone Number"
          v-bind:rules="rules.phonenumber"
        ></v-text-field>

    <v-checkbox
      v-model="isDriver"
      :label="`Sign up as a driver`"
    ></v-checkbox>

      </v-form>

      <v-form v-if="isDriver" v-model="driverValid">

        <v-text-field
          v-model="newAccount.licensenumber"
          label="Driver's license number"
          v-bind:rules="rules.required"
        ></v-text-field>

      </v-form>

      <v-btn v-bind:disabled="!(valid && (isDriver ? driverValid : true))" v-on:click="handleSubmit">
        Sign Up
      </v-btn>

    </div>
  </v-container>
</template>

<script>

import Instructions from "../components/Instructions.vue";
import { mapMutations } from 'vuex';

export default {
  name: "AddVehiclePage",
  components: {
    Instructions, // Use the Instructions component we just imported
  },
  data: function () {
    return {
      valid: false, // Are all the fields in the form valid?
      driverValid: false,

      accountCreated: false,

      // Object to collect account data
      newAccount: {
        firstname: "",
        lastname: "",
        phone: "",
        licensenumber: ""
      },

      isDriver: false,

      // Validation rules for the form fields. This functionality is an extension
      // that"s part of the Vuetify package. Each rule is a list of functions
      // (note the fat arrows). Vuetify invokes all functions in the list,
      // passing it the content of the associated form field. Functions should
      // return either true (the field passes that validation) or a string
      // containing an error message indicating why the field doesn"t pass validation.
      rules: {
        required: [(val) => val.length > 0 || "Required"],
    name: [
    (val) => /^[A-Za-z]+$/.test(val) || "Invalid name",
    ],
    phonenumber: [
    (val) => /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(val) || "Invalid phone number",
    ],
        licenseplate: [
            (val) => /^[A-Za-z]{1,3}-[A-Za-z]{1,2}-[0-9]{1,4}$/.test(val) || "Invalid license plate",
        ]
      },
    };
  },

  mounted: function() {
    //
    console.log( this.$root.currentAccount );
  },

  methods: {
    // Invoked when the user clicks the "Sign Up" button.
    handleSubmit: function () {
      // Haven"t been successful yet.
      this.accountCreated = false;

      let values = {
          firstname: this.newAccount.firstname,
          lastname: this.newAccount.lastname,
          phone: this.newAccount.phone
      }

      let address = "/passenger"
      if( this.isDriver ) {
          address = "/driver";
          values["licensenumber"] = this.newAccount.licensenumber;
      }


      this.$axios.post( address, values )
      .then((result) => {
        // Based on whether things worked or not, show the
        // appropriate dialog.
        if (result.data.ok) {
          this.snackBar("Account successfully created");
          this.$store.commit('logIn', values);
          this.$router.push({ name: "home-page" });
        } else {
          this.snackBar("Account couldn't be created");
        }
      })
      .catch((err) => { this.snackBar("Couldn't contact server"); console.error( err ) });


    },

    snackBar: function( text ) {

      this.setSnack( text );

    },
    ...mapMutations({
      setSnack: 'setSnack'
    })

  },

};

</script>
