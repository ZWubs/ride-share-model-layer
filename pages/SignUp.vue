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

      <div class="text-xs-center">
        <v-dialog v-model="dialogVisible" width="500">
          <v-card>
            <v-card-title primary-title>
              {{ dialogHeader }}
            </v-card-title>

            <v-card-text>
              {{ dialogText }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

    </div>
  </v-container>
</template>

<script>

import Instructions from "../components/Instructions.vue";

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

      // Data to be displayed by the dialog.
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

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
        if (result.data.ok) {
          this.showDialog("Success", result.data.msge);
          this.$store.commit('logIn', values);
          this.accountCreated = true;
        } else {
          this.showDialog("Sorry", result.data.msge);
        }
      })
      .catch((err) => this.showDialog("Failed", err));


    },

    // Helper method to display the dialog box with the appropriate content.
    showDialog: function (header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },

    // Invoked by the "Okay" button on the dialog; dismiss the dialog
    // and navigate to the home page.
    hideDialog: function () {
      this.dialogVisible = false;
      if (this.accountCreated) {
        // Only navigate away from the sign-up page if we were successful.
        this.$router.push({ name: "home-page" });
      }
    }

  },

};

</script>
