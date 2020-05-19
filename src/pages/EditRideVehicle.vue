<template>
  <v-container>
    <div>
      <h4 class="display-1">Edit A Vehicle</h4>

      <instructions details="Edit a vehicle here." />

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
          Update Vehicle
        </v-btn>

      </v-form>

    </div>
  </v-container>
</template>

<script>

import Instructions from "../components/Instructions.vue";

export default {
  name: "EditRideVehiclePage",
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

  computed: {
    vehicle() {
      return this.$store.getters.currentEdittingVehicle;
    },
  },

  mounted: function() {

    this.newVehicle = this.vehicle;
    console.log( this.newVehicle )

  },

  methods: {
    // Invoked when the user clicks the "Sign Up" button.
    handleSubmit: function () {
      // Haven"t been successful yet.
      this.vehicleCreated = false;

      // Post the content of the form to the Hapi server.
      this.$axios.put("/vehicle", {
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

    }

  },
};

</script>
