<template>
	<v-container>
		<div>
			<h4 class="display-1">Add a New Ride</h4>

			<instructions details="Register the details of a new ride here."/>

			<v-form v-model=valid>
				<v-select
					v-model="newRide.dateYear"
					:items=yearsList
					label="Date (Year)"
					v-bind:rules="rules.required">
				</v-select>
				<v-select
					v-model="newRide.dateMonth"
					:items=monthsList
					label="Date (Month)"
					v-bind:rules="rules.required">
				</v-select>
				<v-select
					v-model="newRide.dateDay"
					:items=daysList
					label="Date (Day)"
					v-bind:rules="rules.required">
				</v-select>
				<v-select
					v-model="newRide.timeHr"
					:items=hrList
					label="Time (Hour)"
					v-bind:rules="rules.required">
				</v-select>
				<v-select
					v-model="newRide.timeMin"
					:items=minList
					label="Time (Minute)"
					v-bind:rules="rules.required">
				</v-select>
				<v-text-field
					v-model="newRide.distance"
					label="Distance"
					v-bind:rules="rules.float">
				</v-text-field>
				<v-text-field
					v-model="newRide.fuelPrice"
					label="Fuel Price"
					v-bind:rules="rules.float">
				</v-text-field>
				<v-text-field
					v-model="newRide.fee"
					label="Fee"
					v-bind:rules="rules.float">
				</v-text-field>
				<v-select
					v-model="newRide.vehicleId"
					:items="vehiclesList"
					label="Vehicle"
					v-bind:rules="rules.integer">
				</v-select>
				<v-select
					v-model="newRide.fromLocationId"
					:items="locationsList"
					label="From Location"
					v-bind:rules="rules.required">
				</v-select>
				<v-select
					v-model="newRide.toLocationId"
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
	name:"addRidePage",
	components: {
		Instructions,
	},
	data: function() {
		return {
			valid:false,

			newRide:{
				date: "",
				dateYear: "",
				dateMonth: "",
				dateDay: "",
				time: "",
				timeHr: "",
				timeMin: "",
				distance: "",
				fuelPrice: "",
				fee: "",
				vehicleId: "",
				fromLocationId: "",
				toLocationId: "",
			},

			vehiclesList: [],
			locationsList: [],
			yearsList: [],
			monthsList: [],
			daysList: [],
			hrList: [],
			minList: [],

			rideCreated:false,

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
				licenseplate: [
					(val) => /^[A-Za-z]{1,3}-[A-Za-z]{1,2}-[0-9]{1,4}$/.test(val) || "Invalid license plate",
				]
			},
		};
	},

	mounted: function() {
		this.$axios.get("/getVehicles").then(response => {
			this.vehiclesList = response.data.map( function(obj) {
				return obj.id;
			});
		});

		this.$axios.get("/locations").then(response => {
			this.locationsList = response.data.map( function(obj) {
				return /*obj.city.charAt(0).toUpperCase() + obj.city.slice(1);*/obj.id;
			});
		});

		for( let i = 2020; i < 2031; i++ ) {
			var d = i.toString();
			this.yearsList.push( d );
		}
		console.log(this.yearsList)

		/*for( let i = 0; i < 13; i++ ) {
			if ( i < 10 ){
				let d = "0" + i.toString();
			} else {
				let d = i.toString();	
			}
			this.monthsList.push(d);
		}
		console.log(monthsList)
		console.log

		for( let i = 0; i < 32; i++ ) {
			if ( i < 10 ){
				let d = "0" + i.toString();
			} else {
				let d = i.toString();	
			}
			this.daysList.push(d);
		}
		console.log(daysList)*/

		for ( let i = 0; i < 46; i++ ) {
			// Format string 'd' to fit with the preferred formatting of the server.
			if ( i < 10 ) {
				d = "0" + i.toString();
			} else {
				d = i.toString();
			}
			// Append 'd' to each input list where appropriate.
			if ( i%15 == 0 ) {
				this.minList.push(d);
			}
			if ( i < 32 ) {
				this.daysList.push(d);
				if ( i < 25 ) {
					this.hrList.push(d);
					if ( i < 13 ) {
						this.monthsList.push(d);
					}
				}
			}

		}
		console.log(this.monthsList);
		console.log(this.daysList);
		console.log(this.hrList);
		console.log(this.minList);
	},

	methods: {
		handleSubmit: function() {
			this.rideCreated = false;

			this.newRide.date = this.newRide.dateYear + "-" + this.newRide.dateMonth + "-" + this.newRide.dateDay;
			this.newRide.time = this.newRide.timeHr + ":" + this.newRide.timeMin + ":00";

			console.log(this.newRide.date);
			console.log(this.newRide.time);

			/*this.newRide.date = new Date(this.newRide.date);
			this.newRide.time = time (HH:mm:ss);*/

			this.$axios.post("/ride", {
				date: this.newRide.date,
				time: this.newRide.time,
				vehicleId: this.newRide.vehicleId,
				fuelPrice: this.newRide.fuelPrice,
				fee: this.newRide.fee,
				distance: this.newRide.distance,
				fromLocationId: this.newRide.fromLocationId,
				toLocationId: this.newRide.toLocationId,
			})
			.then((result) => {
				if(result.data.ok) {
					this.showDialog("Success!", result.data.msge);
					this.rideCreated = true;
				} else {
					this.showDialog("Oops!", result.data.msge);
				}
			})

			.catch((err) => {
				this.showDialog("Oh dear...", err + ".\n" + "\ndate: " + this.newRide.date + "\ntime: " + this.newRide.time + "\nvehicleId: " + this.newRide.vehicleId + "\nfuelPrice: " + this.newRide.fuelPrice + "\nfee: " + this.newRide.fee + "\ndistance: " + this.newRide.distance + "\nfromLocationId: " + this.newRide.fromLocationId + "\ntoLocationId: " + this.newRide.toLocationId);
			})
		},

		showDialog: function(header, text) {
			this.dialogHeader = header;
			this.dialogText = text;
			this.dialogVisible = true;
		},

		hideDialog: function() {
			this.dialogVisible = false;
			if (this.accountCreated) {
				this.$router.push({ name: "home-page" });
			}
		},
	},
}

</script>