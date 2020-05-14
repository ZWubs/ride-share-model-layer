<template>
    <div class="text-center">
<!--        <v-menu offset-y>-->
<!--            <template v-slot:activator="{ on } ">-->
<!--                <v-btn-->
<!--                        color="primary"-->
<!--                        dark-->
<!--                        v-on="on"-->
<!--                >-->
<!--                    Dropdown-->
<!--                </v-btn>-->
<!--            </template>-->
<!--            <v-list>-->
<!--                <v-list-item-->
<!--                        v-for="(item, index) in items"-->
<!--                        :key="index"-->
<!--                        @click=""-->
<!--                >-->
<!--                    <v-list-item-title>{{ item.title }}</v-list-item-title>-->
<!--                </v-list-item>-->
<!--            </v-list>-->
<!--        </v-menu>-->
    </div>
</template>

<script>
    export default {
        data: () => ({
            items: [
                { title: 'Click Me' },
                { title: 'Click Me' },
                { title: 'Click Me' },
                { title: 'Click Me 2' },
            ],
        }),
    }
</script>




<!--<template>-->
<!--    <v-container>-->
<!--        <h2>-->
<!--            Your Rides-->
<!--        </h2>-->
<!--        <div>-->
<!--            <v-menu offset-y v-slot: activator="{ click }">-->
<!--                <template>-->
<!--                    <v-btn-->
<!--                            color="primary"-->
<!--                            dark-->
<!--                    >-->
<!--                        Choose a Passenger-->
<!--                    </v-btn>-->
<!--                </template>-->
<!--                <v-list>-->
<!--                    <v-list-item-->
<!--                            v-for="(item, index) in passengersList"-->
<!--                            :key="index"-->
<!--                    >-->
<!--                        <v-list-item-title>{{ item }}</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                </v-list>-->
<!--            </v-menu>-->
<!--            <v-data-table-->
<!--                    :headers="headers"-->
<!--                    :items="passengerRidesList"-->
<!--                    :items-per-page="5"-->
<!--                    class="elevation-1"-->
<!--            ></v-data-table>-->
<!--        </div>-->
<!--    </v-container>-->
<!--</template>-->

<!--<script>-->
<!--    export default {-->
<!--        name: "PassengerRidesPage",-->
<!--        data(){-->
<!--            return{-->
<!--                headers: [-->
<!--                    {-->
<!--                        text: 'Date',-->
<!--                        align: 'start',-->
<!--                        sortable: false,-->
<!--                        value: 'date',-->
<!--                    },-->
<!--                    { text: 'Time', value: 'time' },-->
<!--                    { text: 'To', value: 'tolocationid' },-->
<!--                    { text: 'From', value: 'fromlocationid' },-->
<!--                    { text: 'Fee', value: 'fee' },-->
<!--                    { text: 'Distance', value: 'distance' },-->
<!--                    { text: 'Drivers', value: 'drivers' },-->
<!--                    { text: 'Passengers', value: 'passengers' },-->
<!--                ],-->
<!--                passengerRidesList: [],-->
<!--                passengersList: [],-->
<!--            }-->
<!--        },-->
<!--        mounted: function() {-->
<!--            //Retrieve Passengers for Drop Down-->
<!--            this.$axios.get("/passengers").then(response => {-->
<!--                this.passengersList = response.data.map( function (obj) {-->
<!--                    return `${obj.firstname} ${obj.lastname}`;-->
<!--                });-->
<!--            });-->
<!--            //retrieve rides for a passenger-->
<!--            this.$axios.get("/passenger-rides-list/1").then(response => {-->
<!--                this.passengerRidesList = response.data.map( function (obj) {-->
<!--                    return `${obj.firstname} ${obj.lastname}`;-->
<!--                });-->
<!--            });-->
<!--        },-->

<!--    }-->
<!--</script>-->