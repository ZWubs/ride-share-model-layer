<template>
    <v-container>
        <div>
            <h2>Driver Signup</h2>
            <instructions details="Select the ride you wish to drive for." />

            <v-form v-model="valid">
                <v-text-field
                        v-model = "new_driver.driverFirstName"
                        v-bind:rules = "rules.required"
                        type="first name"
                        label="Driver's First Name"
                        required
                >
                </v-text-field>
                <v-text-field
                        v-model = "new_driver.driverLastName"
                        v-bind:rules = "rules.required"
                        type="last name"
                        label="Driver's Last Name"
                        required
                >
                </v-text-field>
                <v-select
                        v-model = "new_driver.ride"
                        :items="ridesList"
                        v-bind:rules = "rules.required"
                        item-text="text"
                        item-value="value"
                        label="Rides"
                        required
                >
                </v-select>
                <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit">
                    Sign Up
                </v-btn>
            </v-form>
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
        name: "AuthorizationPage",
        components: {
            Instructions
        },
        data: function () {
            return {
                valid: false,

                new_driver: {
                    driverFirstName: "",
                    driverLastName: "",
                    ride: "",
                    vehicle:"",
                },
                ridesList: [],
                driverSignedUp: false,

                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,

                rules: {
                    required: [(val) => val.length > 0 || "Required"]
                },
            };
        },

        mounted() {
            this.getRideData();
        },

        methods: {
            getRideData:async function () {
                //Edit function to take driver and only show vehicles they're authorized for
                try {
                    let response = await this.$axios.get("/rides");
                    let rideArray = response.data;
                    for (let i = 0; i < rideArray.length; i++) {
                        let rideDate = new Date(rideArray[i].date).toDateString();
                        let a_ride = `${rideDate} To: ${rideArray[i].toLocation.address} ${rideArray[i].toLocation.city} ${rideArray[i].toLocation.state} ${rideArray[i].toLocation.zipcode}`;
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
                        firstName: this.new_driver.driverFirstName,
                        lastName: this.new_driver.driverLastName,
                        ride: this.new_driver.ride
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
        }
    }
</script>
