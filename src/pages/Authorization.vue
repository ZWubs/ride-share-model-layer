<template>
    <v-container>
        <div>
            <h4>Authorize a driver to drive a vehicle</h4>

            <v-menu offset-y>
                <template v-slot:activator="scope">
                    <v-btn color="primary" dark v-on="scope.on">
                        Choose a Driver
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in driversList" :key="index" @click="driverClicked=item.id">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-menu offset-y>
                <template v-slot:activator="scope">
                    <v-btn color="primary" dark v-on="scope.on">
                        Choose a Vehicle
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in vehiclesList" :key="index" @click="vehicleClicked=item.id">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn v-on:click="handleSubmit">
                Authorize
            </v-btn>
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
    export default {
        name: "AuthorizationPage",
        data: function (){
            return{
                driverAuthorized:false,
                driversList: [],
                vehiclesList: [],
                driverClicked: null,
                vehicleClicked: null,

                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,

            };
        },
        methods:{
            handleSubmit: function () {
                this.driverAuthorized=false;

                this.$axios
                    .post("/authorization",{
                        driverId:this.driverClicked,
                        vehicleId:this.vehicleClicked
                    })
                    .then((result) => {
                        if (result.data.ok){
                            this.showDialog("Success", result.data.msge)
                            this.driverAuthorized = true;
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
                if (this.driverAuthorized) {
                    // Only navigate away from the Authorization page if we were successful.
                    this.$router.push({ name: "home-page" });
                }
            },
        },
        mounted: async function () {
            //Retrieve Drivers for Drop Down
            let response = await this.$axios.get("/drivers");
            for (let i = 0; i < response.data.length; i++) {
                let driver = response.data[i];
                this.driversList.push({title: `${driver.firstname} ${driver.lastname}`, id: driver.id});
            }
            response = await this.$axios.get("/getVehicles");
            for (let i = 0; i < response.data.length; i++) {
                let vehicle = response.data[i];
                this.vehiclesList.push({title: `${vehicle.id}`, id: vehicle.id});
            }

        },

    }
</script>