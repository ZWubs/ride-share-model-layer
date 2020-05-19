<template>
  <v-container>
    <div>
      <h4 class="display-1">Add A Vehicle</h4>

      <instructions details="Register a vehicle here." />

      <v-form v-model="valid">
        <v-text-field
          v-model="newVehicle.make"
          label="Vehicle make"
          v-bind:rules="rules.required"
        ></v-text-field>

        <v-text-field
          v-model="newVehicle.model"
          label="Vehicle model"
          v-bind:rules="rules.required"
        ></v-text-field>

        <v-text-field
          v-model="newVehicle.color"
          label="Vehicle color"
          v-bind:rules="rules.required"
        ></v-text-field>

        <v-select
          v-model="newVehicle.type"
          :items="vehicleTypeList"
          item-text="text"
          item-value="value"
          label="Vehicle type"
          v-bind:rules="rules.required"
        ></v-select>

        <v-text-field
          v-model="newVehicle.capacity"
          label="Vehicle capacity"
          v-bind:rules="rules.integer"
        ></v-text-field>

        <v-text-field
          v-model="newVehicle.mpg"
          label="Vehicle mpg"
          v-bind:rules="rules.integer"
        ></v-text-field>

        <v-select
          v-model="newVehicle.licensestate"
          :items="statesList"
          item-text="text"
          item-value="value"
          label="Vehicle license plate state"
          v-bind:rules="rules.required"
        ></v-select>

        <v-text-field
          v-model="newVehicle.licensenumber"
          label="Vehicle license plate number"
          v-bind:rules="rules.required"
        ></v-text-field>

        <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit">
          Add Vehicle
        </v-btn>

      </v-form>

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

      // Object to collect account data
      newVehicle: {
        make: "",
        model: "",
        color: "",
        type: "",
        capacity: "",
        mpg: "",
        licensestate: "",
        licensenumber: "",
      },

      vehicleTypeList: [],
      statesList: [],

      // Was an account created successfully?
      vehicleCreated: false,

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
        integer: [
            (val) => /[0-9]+$/.test(val) || "Invalid number",
        ],
        float: [
            (val) => /[0-9]+.*[0-9]*$/.test(val) || "Invalid number",
        ],
        licenseplate: [
            (val) => /^[A-Za-z]{1,3}-[A-Za-z]{1,2}-[0-9]{1,4}$/.test(val) || "Invalid license plate",
        ]
      },
    };
  },

  mounted: function() {
    //
    this.$axios.get("/vehicle-types").then(response => {
        this.vehicleTypeList = response.data.map( function (obj) {
          return obj.type.charAt(0).toUpperCase() + obj.type.slice(1);
        });
    });

    //
    this.$axios.get("/states").then(response => {
        this.statesList = response.data.map( function (obj) {
          return obj.name;
        });
    });
  },

  methods: {
    // Invoked when the user clicks the "Sign Up" button.
    handleSubmit: function () {

      // Haven"t been successful yet.
      this.vehicleCreated = false;

      // Post the content of the form to the Hapi server.
      this.$axios.post("/vehicle", {
          make: this.newVehicle.make,
          model: this.newVehicle.model,
          color: this.newVehicle.color,
          type: this.newVehicle.type.toLowerCase(),
          capacity: this.newVehicle.capacity,
          mpg: this.newVehicle.mpg,
          licensestate: this.newVehicle.licensestate,
          licensenumber: this.newVehicle.licensenumber,
      })
      .then((result) => {
        // Based on whether things worked or not, show the
        // appropriate dialog.
        if (result.data.ok) {
          this.showDialog("Success", result.data.msge);
          this.vehicleCreated = true;
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
      if (this.vehicleCreated) {
        // Only navigate away from the sign-up page if we were successful.
        this.$router.push({ name: "home-page" });
      }
    },
  },
};

</script>
