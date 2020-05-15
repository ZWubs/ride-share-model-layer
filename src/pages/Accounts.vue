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
          v-model="selected"
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
          <tr
            v-on:click="selectAccount(item)"
            v-bind:class="{ selected: selected == item}"
          >
            <td><v-layout>{{ item.firstname }}</v-layout></td>
            <td><v-layout>{{ item.lastname }}</v-layout></td>
            <td><v-layout>{{ item.phone }}</v-layout></td>
            <td>
              <v-layout justify-center>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="item.status == 'Administrator'">
                      mdi-console
                    </v-icon>
                  </template>
                  <span>Administrator</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="item.status == 'Passenger'">
                      mdi-account
                    </v-icon>
                  </template>
                  <span>Passenger</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="item.status == 'Driver'">
                      mdi-car
                    </v-icon>
                  </template>
                  <span>Driver</span>
                </v-tooltip>

              </v-layout>
            </td>
            <td><v-layout justify-center>{{ item.accountid }}</v-layout></td>
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
        {
          text: 'First Name',
          align: 'start',
          value: 'firstname',
        },
        { text: 'Last Name', value: 'lastname' },
        { text: 'Phone Number', value: 'phone' },
        { text: 'Status', value: 'status', align: 'center', width: "1%" },
    { text: 'Account ID', value: 'accountid', align: 'center', width: "1%" },
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
        accountid: obj.accountid
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
        accountid: obj.accountid
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
        accountid: obj.accountid
      }
    });
    });

    this.accountsList = this.administratorsList.concat( this.driversList , this.passengersList );

    this.accountsList.sort((a, b) => (a.accountid > b.accountid) ? 1 : -1);

  },

  methods: {
    // Invoked when the user clicks the "Sign Up" button.
    handleSubmit: function () {
      this.$root.currentAccount;


    },

    handleClick(value) {
      console.log( value );
    },

    itemClass(item) {
      const currentAccount = this.$root.currentAccount;
      if (currentAccount && currentAccount.accountid === item.accountid) {
    console.log( currentAccount.accountid, item.accountid )
        return "currentAccount";
      }
    },

    selectAccount(item) {
    this.selected = item;
    this.$root.currentAccount = item;
    console.log( this.$root.currentAccount )
    }

  },
};

</script>

<style>

.selected {
  background: lightblue;
}

</style>
