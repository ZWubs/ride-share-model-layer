<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="scope">
        <v-btn color="primary" dark v-on="scope.on">
          Choose a Passenger
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="itemClicked(item)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data: () => ({
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" },
      ],
    }),

    methods: {
      itemClicked(item) {
        console.log("CLICK on item", item.title);
      }
    }
  };
</script>
