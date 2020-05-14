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
  name: "RideReport",
  components: { Instructions },
  data() {
    return {
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: false,
          value: "date",
        },
      { text: "Time", value: "time" },
      { text: "To", value: "tolocationid" },
      { text: "From", value: "fromlocationid" },
      { text: "Fee", value: "fee" },
      { text: "Distance", value: "distance" },
      { text: "Drivers", value: "drivers" },
      { text: "Passengers", value: "passengers" },
  ],
      rides: [],
  };
  },
    mounted: async function() {
        console.log("about to GET");
        let response;
        response = await this.$axios.get("/rides");
        console.log("GET  happened", response);
        this.rides = response.data.map((obj) => {
            // console.log(obj.date.parse());
            obj.date = new Date(obj.date);
            return obj;
        });
    },
};
    //     mounted: async function() {
    //         // console.log("about to GET");
    //         let response;
    //         response = await this.$axios.get("/rides");
    //         let rideArray=response.data;
    //         for (let i = 0; i<rideArray.length; i++){
    //             rideArray[i].tolocationid=await this.$axios.get(`/address/${rideArray[i].tolocationid}`);
    //             console.log(rideArray[i].tolocationid);
    //             this.rides.push(rideArray[i]);
    //             //Get locations
    //             //Get Drivers
    //             //     //obj.drivers =
    //             //     //Get passengers
    //             //     //obj.passengers =
    //             //     //Format Date
    //             //     // console.log(obj.date.parse());
    //         }
    //         // this.rides = response.data.map((obj) => {
    //         //     this.$axios.get(`/address/${obj.fromlocationid}`)
    //         //         .then((result)=>{
    //         //             console.log("LOOK HERE");
    //         //             console.log(result);
    //         //             obj.fromlocationid = result.data;
    //         //         })
    //         //         .catch((err)=> {console.log(`Failed: ${err}`)});
    //         //     // obj.tolocationid=await this.$axios.get(`/address/${obj.tolocationid}`);
    //         //
    //         //     return obj;
    //         // });
    //     },
    // }
</script>
