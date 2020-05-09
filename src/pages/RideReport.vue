<template>
    <v-container>
        <h2>
            Rides
        </h2>
        <instructions details="View upcoming rides here."></instructions>
        <v-data-table
            :headers="headers"
            :items="rides"
            :items-per-page="5"
            class="elevation-1"
        ></v-data-table>
    </v-container>
</template>

<script>
    import Instructions from "../components/Instructions";
    export default {
        components: {Instructions},
        data () {
            return {
                headers: [
                    {
                        text: 'Date',
                        align: 'start',
                        sortable: false,
                        value: 'date',
                    },
                    { text: 'Time', value: 'time' },
                    { text: 'To', value: 'tolocationid' },
                    { text: 'From', value: 'fromlocationid' },
                    { text: 'Fee', value: 'fee' },
                    { text: 'Distance', value: 'distance' },
                    { text: 'Drivers', value: 'drivers' },
                    { text: 'Passengers', value: 'passengers' },
                ],
                rides: [],
            }
        },
        mounted: async function() {
            console.log("about to GET");
            let response;
            response = await this.$axios.get("/rides");
            console.log(`GET  happened ${response}`);
            this.rides = response.data.map( (obj) => {
                console.log(obj.date.parse());
                return obj;
            });
        },
    }
</script>