<template>
    <v-container>
        <div>
            <h2>Driver Signup</h2>
            <instructions details="Select the ride you wish to drive for." />
            <v-form v-model="valid">
                <v-select
                        :items="rideIds"
                        v-model = "ride"
                        type="Select"
                        label="Choose Ride"
                        required
                >
                </v-select>
                <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit()">
                    Sign Up
                </v-btn>
            </v-form>
            <v-form>

            </v-form>
            <v-data-table
                    :headers="headers"
                    :items="ridesList"
                    :items-per-page="5"
                    class="elevation-1"
            ></v-data-table>
        </div>

        <div class="text-xs-center">
            <v-dialog v-model='dialogVisible' width="500">
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
    </v-container>
</template>

<script>
    import Instructions from "../components/Instructions.vue";
    export default {
        name: "DriverSignup",
        components: {
            Instructions
        },
        data: function () {
            return {
                valid: false,
                headers: [
                    {
                        text: "Date",
                        align: "start",
                        sortable: true,
                        value: "date",
                    },
                    { text: "Id", value: "id"},
                    { text: "Time", value: "time" },
                    { text: "To", value: "toLocation" },
                    { text: "From", value: "fromLocation" },
                    { text: "Fee", value: "fee" },
                    { text: "Distance", value: "distance" },
                    { text: "Vehicle", value: "vehicle" },
                    { text: "Drivers", value: "drivers" },
                    { text: "Passengers", value: "passengers" },
                ],

                ride:{},
                ridesList: [],
                rideIds:[],
                driverSignedUp: false,

                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,

                rules: {
                    required: [(val) => val.length > 0 || "Required"]
                },
            };
        },

        methods: {
            getRideData:async function () {
                //Edit function to take driver and only show vehicles they're authorized for
                try {
                    let response= await this.$axios.get("/rides");
                    let rideArray=response.data;
                    console.log(rideArray);
                    for (let i = 0; i<rideArray.length; i++){
                        let a_ride = rideArray[i];
                        //Format Date
                        a_ride.date = new Date(a_ride.date).toDateString();
                        //Set Vehicle
                        a_ride.vehicle = a_ride.vehicle.licensenumber;
                        //Set Locations
                        a_ride.toLocation = `${a_ride.toLocation.address} ${a_ride.toLocation.city}, ${a_ride.toLocation.state} ${a_ride.toLocation.zipcode}`;
                        a_ride.fromLocation = `${a_ride.fromLocation.address} ${a_ride.fromLocation.city}, ${a_ride.fromLocation.state} ${a_ride.fromLocation.zipcode}`;
                        //Set Drivers
                        let drivers_array=[];
                        for(let i = 0; i<a_ride.drivers.length; i++){
                            drivers_array.push(`${a_ride.drivers[i].firstname} ${a_ride.drivers[i].lastname}`);
                        }
                        a_ride.drivers=drivers_array;
                        //Set Passengers
                        let passengers_array=[];
                        for(let i = 0; i<a_ride.passengers.length; i++){
                            passengers_array.push(`${a_ride.passengers[i].firstname} ${a_ride.passengers[i].lastname}`);
                        }
                        a_ride.passengers=passengers_array;

                        this.rideIds.push(a_ride.id);
                        this.ridesList.push(a_ride);
                }
                this.ridesList.sort();
                } catch (e) {
                    console.log(e);
                }
            },


            handleSubmit: function () {
                this.driverSignedUp = false;
                this.$axios
                    .post("/driver-signup", {
                        accountId: this.$store.state.currentAccount.accountId,
                        rideId: this.ride,
                    })
                    .then((result) => {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge)
                            this.driverSignedUp = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    })
                    .catch((err) => this.showDialog("Failed", err));

            },

            // Helper method to display the dialog box with the appropriate content.
            // From Dr. Tom Nurkkala's Modify Single-Page Assignment
            showDialog: function (header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },

            // Invoked by the "Okay" button on the dialog; dismiss the dialog
            // and navigate to the home page.
            // From Dr. Tom Nurkkala's Modify Single-Page Assignment
            hideDialog: function () {
                this.dialogVisible = false;
                if (this.driverSignedUp) {
                    // Only navigate away from the Authorization page if we were successful.
                    this.$router.push({name: "home-page"});
                }
            },
        },

        mounted() {
            this.getRideData();
        },
    }
</script>
