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
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.date }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.toLocation }}</td>
          <td>{{ item.fromLocation }}</td>
          <td>{{ item.fee }}</td>
          <td>{{ item.distance }}</td>
          <td>{{ item.vehicle }}</td>
          <td>{{ item.drivers }}</td>
          <td>{{ item.passengers }}</td>
          <td>
            <v-layout justify-center>
              <v-btn icon @click="editRideVehicle(item)">
                <v-icon>mdi-car</v-icon>
              </v-btn>
              <v-btn icon @click="addRideVehicle(item)">
                <v-icon>mdi-car</v-icon>
              </v-btn>
            </v-layout>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
    import Instructions from "../components/Instructions";
    export default {
          name: "RideReport",
          components: { Instructions },
          data() {
            return {
              addRideVehicleVisible: false,
              editRideVehicleVisible: false,
              workingRide: null,
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
                { text: "Actions", align: 'center' }
              ],
              rides: [],
          };
          },
        methods: {

          addRideVehicle: function( ride ) {

            this.workingRide = ride;
            this.addRideVehicleVisible = true;

          },
          hideDialog: function () {

            this.addRideVehicleVisible = false;
            this.editRideVehicleVisible = false;

          },

          editRideVehicle: function( ride ) {
            this.$store.commit('changeEdittingVehicle', ride.vehicle );
            this.$router.push({ name: "edit-ride-vehicle-page" });
          }

        },
        mounted: async function() {
          try{
            let response= await this.$axios.get("/rides");
            let rideArray=response.data;
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

              this.rides.push(rideArray[i]);
            }
          } catch (e) {
            console.log(e);
          }
        },
    }
</script>
