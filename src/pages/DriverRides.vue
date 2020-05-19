<template>
    <div >
        <h2>Driver Rides</h2>
        <instructions details="View rides a person is driving."></instructions>
        <v-menu offset-y>
            <template v-slot:activator="scope">
                <v-btn color="primary" dark v-on="scope.on">
                    Choose a Driver
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(item, index) in driversList" :key="index" @click="itemClicked(item.id)">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-data-table
                :headers="headers"
                :items="ridesList"
                :items-per-page="5"
                class="elevation-1"
        ></v-data-table>
    </div>
</template>

<script>
    import Instructions from "../components/Instructions";
    export default {
        name: "DriverRides",
        components: { Instructions },
        data: () => {
            return ({
                headers: [
                    {
                        text: "Date",
                        align: "start",
                        sortable: true,
                        value: "date",
                    },
                    { text: "Time", value: "time" },
                    { text: "To", value: "toLocation" },
                    { text: "From", value: "fromLocation" },
                    { text: "Fee", value: "fee" },
                    { text: "Distance", value: "distance" },
                    { text: "Vehicle", value: "vehicle" },
                    { text: "Drivers", value: "drivers" },
                    { text: "Passengers", value: "passengers" },
                ],
                driversList: [],
                ridesList:[],
            });
        },
        methods: {
            itemClicked: async function (driverId) {
                try {
                    let response = await this.$axios.get("/rides");
                    let rideArray = response.data;
                    this.ridesList = [];
                    for (let i = 0; i < rideArray.length; i++) {
                        let a_ride = rideArray[i];
                        for (let j = 0; j < a_ride.drivers.length; j++) {
                            if (a_ride.drivers[j].id === driverId) {
                                //Format Date
                                a_ride.date = new Date(a_ride.date).toDateString();
                                //Set Vehicle
                                a_ride.vehicle = a_ride.vehicle.licensenumber;
                                //Set Locations
                                a_ride.toLocation = `${a_ride.toLocation.address} ${a_ride.toLocation.city}, ${a_ride.toLocation.state} ${a_ride.toLocation.zipcode}`;
                                a_ride.fromLocation = `${a_ride.fromLocation.address} ${a_ride.fromLocation.city}, ${a_ride.fromLocation.state} ${a_ride.fromLocation.zipcode}`;
                                //Set Drivers
                                let drivers_array = [];
                                for (let i = 0; i < a_ride.drivers.length; i++) {
                                    drivers_array.push(`${a_ride.drivers[i].firstname} ${a_ride.drivers[i].lastname}`);
                                }
                                a_ride.drivers = drivers_array;
                                //Set Passengers
                                let passengers_array = [];
                                for (let i = 0; i < a_ride.passengers.length; i++) {
                                    passengers_array.push(`${a_ride.passengers[i].firstname} ${a_ride.passengers[i].lastname}`);
                                }
                                a_ride.passengers = passengers_array;

                                this.ridesList.push(rideArray[i]);
                            }
                        }
                    }
                } catch (e) {
                    console.log(`Ride Retrieval Failed: ${e}`);
                }
            },
        },
        mounted: async function () {
            //Retrieve Passengers for Drop Down
            let response = await this.$axios.get("/drivers");
            for (let i = 0; i < response.data.length; i++) {
                let driver = response.data[i];
                this.driversList.push({title: `${driver.firstname} ${driver.lastname}`, id: driver.id});
            }
            try {
                response = await this.$axios.get("/rides");
                let rideArray = response.data;
                for (let i = 0; i < rideArray.length; i++) {
                    let a_ride = rideArray[i];
                    //Format Date
                    a_ride.date = new Date(a_ride.date).toDateString();
                    //Set Vehicle
                    a_ride.vehicle = a_ride.vehicle.licensenumber;
                    //Set Locations
                    a_ride.toLocation = `${a_ride.toLocation.address} ${a_ride.toLocation.city}, ${a_ride.toLocation.state} ${a_ride.toLocation.zipcode}`;
                    a_ride.fromLocation = `${a_ride.fromLocation.address} ${a_ride.fromLocation.city}, ${a_ride.fromLocation.state} ${a_ride.fromLocation.zipcode}`;
                    //Set Drivers
                    let drivers_array = [];
                    for (let i = 0; i < a_ride.drivers.length; i++) {
                        drivers_array.push(`${a_ride.drivers[i].firstname} ${a_ride.drivers[i].lastname}`);
                    }
                    a_ride.drivers = drivers_array;
                    //Set Passengers
                    let passengers_array = [];
                    for (let i = 0; i < a_ride.passengers.length; i++) {
                        passengers_array.push(`${a_ride.passengers[i].firstname} ${a_ride.passengers[i].lastname}`);
                    }
                    a_ride.passengers = passengers_array;

                    this.ridesList.push(rideArray[i]);
                }
            } catch (e) {
                console.log(`Ride Retrieval Failed: ${e}`);
            }
        },
    }
</script>
