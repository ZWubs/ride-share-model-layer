<template>
    <v-container>
        <div>
            <h4>Authorize a driver to drive a vehicle</h4>

            <v-form v-model="valid">
                <v-text-field
                    v-model = "new_auth.driverFirstName"
                    v-bind:rules = "rules.required"
                    type="first name"
                    label="Driver's First Name"
                    required
                >
                </v-text-field>
                <v-text-field
                        v-model = "new_auth.driverLastName"
                        v-bind:rules = "rules.required"
                        type="last name"
                        label="Driver's Last Name"
                        required
                >
                </v-text-field>
                <v-text-field
                        v-model = "new_auth.licensePlate"
                        v-bind:rules = "rules.required"
                        type="license plate"
                        label="Vehicle License Plate"
                        required
                >
                </v-text-field>
                <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit">
                    Authorize
                </v-btn>
            </v-form>
        </div>

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
    </v-container>
</template>

<script>
    export default {
        name: "AuthorizationPage",
        data: function (){
            return{
                valid: false,

                new_auth:{
                    driverFirstName:"",
                    driverLastName:"",
                    licensePlate:"",
                },

                driverAuthorized:false,

                rules: {
                    required: [(val) => val.length > 0 || "Required"]
                },
            };
        },
        methods:{
            handleSubmit: function () {
                this.driverAuthorized=false;

                this.$axios
                    .post("/authorization",{
                        driverFirstName:this.new_auth.driverFirstName,
                        driverLastName:this.new_auth.driverLastName,
                        licensePlate:this.new_auth.licensePlate
                    })
                    .then((result => {
                        if (result.data.ok){
                            this.showDialog("Success", result.data.msge)
                            this.driverAuthorized = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }))
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
                if (this.driverAuthorized) {
                    // Only navigate away from the reset password page if we were successful.
                    this.$router.push({ name: "home-page" });
                }
            },
        }
    }
</script>