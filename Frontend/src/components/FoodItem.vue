<script lang="ts">
export default {
  props: {
    foodName: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
}
</script>

<template>
  <router-link class="card"
      :to="{
        name: 'food',
        params: {
          name: foodName,
        },
        query: {
          id: id
        }
      }">
      <h1>{{ foodName }}</h1>
    </router-link>
</template>

<style>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 300px;
  margin: 10px;
  text-align: center;
  font-family: arial;
  float: left;
}
</style>