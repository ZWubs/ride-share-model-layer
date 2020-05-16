<template>
  <v-container>
    <div>

      <template>

        <v-card-title>

          Accounts

          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="accountsList"
          :search="search"
          hide-default-footer
          item-key="name"
          class="elevation-1"
          disable-sort
          loading="true"
          loading-text="Loading Accounts..."
        >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.firstname }}</td>
            <td>{{ item.lastname }}</td>

            <td>
              <v-layout v-if="item.phone">
                {{ item.phone }}
              </v-layout>
            </td>

            <td>
              <v-layout justify-center>
                <v-chip outlined :color="item.color">
                  {{ item.status }}
                </v-chip>
              </v-layout>
            </td>

            <td>
              <v-layout justify-center>
                {{ item.accountid }}
              </v-layout>
            </td>

            <td>
              <v-layout justify-center>

                <v-btn icon @click="signInAsUser( item )">
                  <v-icon>mdi-login</v-icon>
                </v-btn>

                <v-btn icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>

              </v-layout>
            </td>

          </tr>
        </template>
        </v-data-table>
      </template>

    </div>
  </v-container>
</template>

<script>

export default {
  name: "SelectAccountPage",
  data: function () {
    return {

      valid: false, // Are all the fields in the form valid?

      search: '',

      singleSelect: true,
      selected: "",

      passengersList: [],
      driversList: [],
      administratorsList: [],

      accountsLoaded: false,
      accountsList: [],

      headers: [
        { text: 'First Name', align: 'start', value: 'firstname' },
        { text: 'Last Name', value: 'lastname' },
        { text: 'Phone Number', value: 'phone' },
        { text: 'Status', value: 'status', align: 'center', width: "1%" },
        { text: 'Account ID', value: 'accountid', align: 'center', width: "1%" },
        { text: 'Actions', align: 'center' }
      ],

    };
  },

  mounted: async function() {
    //
    await this.$axios.get("/passengers").then(response => {
      this.passengersList = response.data.map( function (obj) {
        return {
          firstname: obj.firstname,
          lastname: obj.lastname,
          phone: obj.phone,
          status: "Passenger",
          accountid: obj.accountid,
          color: "blue"
        }
      });
    });

    await this.$axios.get("/drivers").then(response => {
      this.driversList = response.data.map( function (obj) {
        return {
          firstname: obj.firstname,
          lastname: obj.lastname,
          phone: obj.phone,
          status: "Driver",
          accountid: obj.accountid,
          color: "green"
        }
      });
    });

    await this.$axios.get("/administrators").then(response => {
      this.administratorsList = response.data.map( function (obj) {
        return {
          firstname: obj.firstname,
          lastname: obj.lastname,
          phone: obj.phone,
          status: "Administrator",
          accountid: obj.accountid,
          color: "red"
        }
      });
    });

    this.accountsList = this.administratorsList.concat( this.driversList , this.passengersList );

    this.accountsList.sort((a, b) => (a.accountid > b.accountid) ? 1 : -1);

  },

  methods: {

    signInAsUser: function( user ) {

      console.log( user );

      this.$store.commit("logIn", user);
      this.$router.push({ name: "home-page" });

    }

  },
};

</script>

<style>

.selected {
  background: lightblue;
}

</style>
