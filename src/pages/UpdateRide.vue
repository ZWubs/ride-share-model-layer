<template>
	<v-container>
		<div>
			<h4 class="display-1">Update a Ride</h4>

			<instructions details="Update the details of a specific ride."/>

			<v-form v-model=valid>
				<v-select
					v-model="thisRide.id"
					:items="rideList"
					v-on:change="dataEval"
					label="Ride ID"
					v-bind:rules="rules.integer">
				</v-select>
				<v-text-field
					v-model="thisRide.date"
					label="Date (MUST follow YYYY-MM-DD format)"
					v-bind:rules="rules.required">
				</v-text-field>
				<v-text-field
					v-model="thisRide.time"
					label="Time (MUST follow HH:mm format)"
					v-bind:rules="rules.required">
				</v-text-field>
				<v-text-field
					v-model="thisRide.distance"
					label="Distance"
					v-bind:rules="rules.float">
				</v-text-field>
				<v-text-field
					v-model="thisRide.fuelPrice"
					label="Fuel Price"
					v-bind:rules="rules.float">
				</v-text-field>
				<v-text-field
					v-model="thisRide.fee"
					label="Fee"
					v-bind:rules="rules.integer">
				</v-text-field>
				<v-select
					v-model="thisRide.vehicleId"
					:items="vehiclesList"
					label="Vehicle"
					v-bind:rules="rules.integer">
				</v-select>
				<v-select
					v-model="thisRide.fromLocationId"
					:items="locationsList"
					label="From Location"
					v-bind:rules="rules.required">
				</v-select>
				<v-select
					v-model="thisRide.toLocationId"
					:items="locationsList"
					label="To Location"
					v-bind:rules="rules.required">
				</v-select>
				<v-btn v-bind:disabled="!valid" v-on:click="handleSubmit">
					Submit
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
						<v-btn color="primary" text v-on:click="hideDialog">OK</v-btn>
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
	name:"updateRidePage",
	components: {
		Instructions,
	},
	data: function() {
		return {
			valid:false,

			thisRide:{
				id:"",
				date: "",
				time: "",
				distance: "",
				fuelPrice: "",
				fee: "",
				vehicleId: "",
				fromLocationId: "",
				toLocationId: "",
			},

			vehiclesList: [],
			locationsList: [],
			rideList: [],

			rideUpdated:false,

			dialogHeader:"<no dialogHeader>",
			dialogText:"<no dialogText>",
			dialogVisible:false,

			rules: {
				required: [(val) => val.length != 0 || "Required"],
				integer: [
					(val) => /[0-9]+$/.test(val) || "Invalid number",
				],
				float: [
					(val) => /[0-9]+.*[0-9]*$/.test(val) || "Invalid number",
				],
			},
		};
	},

	mounted: function() {
		this.$axios.get("/get-rides").then(response => {
			this.rideList = response.data.map( function(obj) {
				return obj.id;
			});
		});

		this.$axios.get("/getVehicles").then(response => {
			this.vehiclesList = response.data.map( function(obj) {
				return obj.id;
			});
		});

		this.$axios.get("/locations").then(response => {
			this.locationsList = response.data.map( function(obj) {
				return obj.id;
			});
		});
	},

	methods: {
		dataEval: function () {
			let oldRide = {};
			this.$axios.get("/get-rides")
			.then(response => {
				for ( let i = 0; i < response.data.length; i++ ) {
					if ( response.data[i].id == this.thisRide.id ) {
						const oldData = Object.assign(oldRide, response.data[i]);
						console.log(oldData.id);
						this.thisRide.date = oldData.date.substring(0,10);
						this.thisRide.time = oldData.time.substring(0,5);
						this.thisRide.distance = oldData.distance;
						this.thisRide.fuelPrice = oldData.fuelprice;
						this.thisRide.fee = oldData.fee;
						this.thisRide.vehicleId = oldData.vehicleid;
						this.thisRide.toLocationId = oldData.tolocationid;
						this.thisRide.fromLocationId = oldData.fromlocationid;
					}
				}
			});
		},

		handleSubmit: function() {
			this.rideUpdated = false;

			const newTime = this.thisRide.time + ":00";

			this.$axios.put("/ride-update", {
				id: this.thisRide.id,
				date: this.thisRide.date,
				time: newTime,
				vehicleId: this.thisRide.vehicleId,
				fuelPrice: this.thisRide.fuelPrice,
				fee: this.thisRide.fee,
				distance: this.thisRide.distance,
				fromLocationId: this.thisRide.fromLocationId,
				toLocationId: this.thisRide.toLocationId,
			})
			.then((result) => {
				if(result.data.ok) {
					this.showDialog("Success!", result.data.msge);
					this.rideUpdated = true;
				} else {
					this.showDialog("Oops!", result.data.msge);
				}
			})

			.catch((err) => {
				this.showDialog("Oh dear...", err);
			});
		},

		showDialog: function(header, text) {
			this.dialogHeader = header;
			this.dialogText = text;
			this.dialogVisible = true;
		},

		hideDialog: function() {
			this.dialogVisible = false;
			if (this.rideUpdated) {
				this.$router.push({ name: "home-page" });
			}
		},
	},
}

</script>