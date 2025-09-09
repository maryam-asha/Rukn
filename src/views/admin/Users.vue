<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      {{ $t('users_table') }}

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>
    <v-data-table
      v-model:search="search"
      :filter-keys="['name']"
      :items="items"
    >
      <template v-slot:header.stock>
        <div class="text-end">Stock</div>
      </template>


      <template v-slot:item.rating="{ item }">
        <v-rating
          :model-value="item.rating"
          color="orange-darken-2"
          density="compact"
          size="small"
          readonly
        ></v-rating>
      </template>

      <template v-slot:item.stock="{ item }">
        <div class="text-end">
          <v-chip
            :color="item.stock ? 'green' : 'red'"
            :text="item.stock ? 'In stock' : 'Out of stock'"
            class="text-uppercase"
            size="small"
            label
          ></v-chip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>


<script setup>
  import { ref } from 'vue'

  const search = ref('')
  const items = [
    {
      name: 'Nebula GTX 3080',
      price: 699.99,
      rating: 5,
      stock: true,
    },
    {
      name: 'Galaxy RTX 3080',
      price: 799.99,
      rating: 4,
      stock: false,
    },
    {
      name: 'Orion RX 6800 XT',
      price: 649.99,
      rating: 3,
      stock: true,
    },
    {
      name: 'Vortex RTX 3090',
      price: 1499.99,
      rating: 4,
      stock: true,
    },
    {
      name: 'Cosmos GTX 1660 Super',
      price: 299.99,
      rating: 4,
      stock: false,
    },
  ]
</script>
