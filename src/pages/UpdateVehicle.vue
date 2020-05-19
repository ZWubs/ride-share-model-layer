<template>
<v-container>
	<div>
	<h4 class="display-1">Update A Vehicle</h4>

	<instructions details="Update a registered vehicle here." />

	<v-form v-model="valid">
		<v-select
		v-model="thisVehicle.id"
		:items="idList"
		label="Vehicle ID"
		v-on:change="dataEval"
		v-bind:rules="rules.required"
		></v-select>

		<v-text-field
		v-model="thisVehicle.make"
		label="Vehicle make"
		v-on:change="dataEval"
		v-bind:rules="rules.required"
		></v-text-field>

		<v-text-field
		v-model="thisVehicle.model"
		label="Vehicle model"
		v-bind:rules="rules.required"
		></v-text-field>

		<v-text-field
		v-model="thisVehicle.color"
		label="Vehicle color"
		v-bind:rules="rules.required"
		></v-text-field>

		<v-select
		v-model="thisVehicle.type"
		:items="vehicleTypeList"
		label="Vehicle type"
		v-bind:rules="rules.required"
		></v-select>

		<v-text-field
		v-model="thisVehicle.capacity"
		label="Vehicle capacity"
		v-bind:rules="rules.integer"
		></v-text-field>

		<v-text-field
		v-model="thisVehicle.mpg"
		label="Vehicle mpg"
		v-bind:rules="rules.integer"
		></v-text-field>

		<v-select
		v-model="thisVehicle.licensestate"
		:items="statesList"
		label="Vehicle license plate state"
		v-bind:rules="rules.required"
		></v-select>

		<v-text-field
		v-model="thisVehicle.licensenumber"
		label="Vehicle license plate number"
		v-bind:rules="rules.required"
		></v-text-field>

		<v-btn v-bind:disabled="!valid" v-on:click="handleSubmit">
		Update Vehicle
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
	name: "UpdateVehiclePage",
	components: {
		Instructions,
	},
	data: function() {
		return {
			valid: false,

			thisVehicle: {
				id:"",
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
			idList: [],
			typeDict: [],

			// Was an account created successfully?
			vehicleUpdated: false,

			// Data to be displayed by the dialog.
			dialogHeader: "<no dialogHeader>",
			dialogText: "<no dialogText>",
			dialogVisible: false,

			rules: {
				required: [(val) => val.length != 0 || "Required"],
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
		
		this.$axios.get("/vehicle-types-raw").then(response => {
			for ( let i = 0; i < response.data.length; i++ ) {
				let typeIdx = {};
				typeIdx.id = response.data[i].id;
				typeIdx.type = response.data[i].type;
				this.typeDict.push(typeIdx);
			}
		});
		
		//
		this.$axios.get("/vehicle-types").then(response => {
			this.vehicleTypeList = response.data.map( function (obj) {
			return obj.type.charAt(0).toUpperCase() + obj.type.slice(1);
			});
		});
		
		this.$axios.get("/getVehicles").then(response => {
			this.idList = response.data.map( function(obj) {
				return obj.id;
			});
		});

		//
		this.$axios.get("/states-abbreviations").then(response => {
			this.statesList = response.data.map( function (obj) {
			return obj.abbreviation;
			});
		});
	},

	methods: {
		// Invoked when the user clicks the "Sign Up" button.
		handleSubmit: function () {

			// Haven"t been successful yet.
			this.vehicleUpdated = false;

			let vTypeId = null;

			for ( let i = 0; i < this.typeDict.length; i++ ) {
				if ( this.typeDict[i].type == this.vType ) {
					vTypeId = this.typeDict[i].id;
				}
			}

			// Post the content of the form to the Hapi server.
			this.$axios.put("/vehicle-update", {
				id: this.thisVehicle.id,
				make: this.thisVehicle.make,
				model: this.thisVehicle.model,
				color: this.thisVehicle.color,
				type: vTypeId,
				capacity: this.thisVehicle.capacity,
				mpg: this.thisVehicle.mpg,
				licensestate: this.thisVehicle.licensestate,
				licensenumber: this.thisVehicle.licensenumber,
			})
			.then((result) => {
				if (result.data.ok) {
					this.showDialog("Success", result.data.msge);
					this.vehicleUpdated = true;
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
		if (this.vehicleUpdated) {
			// Only navigate away from the sign-up page if we were successful.
			this.$router.push({ name: "home-page" });
		}
		},
		
		dataEval: function () {
			let oldVehicle = {};
			let vType = "";
			this.$axios.get("/list-vehicles")
			.then(response => {
				for ( let i = 0; i < response.data.length; i++ ) {
					if ( response.data[i].id == this.thisVehicle.id ) {
						let oldData = Object.assign(oldVehicle, response.data[i]);
						console.log(oldData.id);
						for ( let v = 0; v < this.typeDict.length; v++ ) {
							console.log(`v = ${v}, which brings up the typeDict entry with id "${this.typeDict[v].id}" and type "${this.typeDict[v].type}."`);
							if ( this.typeDict[v].id == oldData.vehicletypeid ) {
								let str = this.typeDict[v].type;
								let strLen = 1 + str.length;
								vType = str[0].toUpperCase() + str.substring( 1, strLen );
							}
						}
						console.log(`This vehicle is a ${vType}.`);
						this.thisVehicle.id = oldData.id;
						this.thisVehicle.make = oldData.make;
						this.thisVehicle.model = oldData.model;
						this.thisVehicle.color = oldData.color;
						this.thisVehicle.type = vType;
						this.thisVehicle.capacity = oldData.capacity;
						this.thisVehicle.mpg = oldData.mpg;
						this.thisVehicle.licensestate = oldData.licensestate;
						this.thisVehicle.licensenumber = oldData.licensenumber;
					}
				}
			});
		},
	},
};

</script>
