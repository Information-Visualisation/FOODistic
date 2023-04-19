<script lang="ts">
import FoodImg from './FoodImg.vue';

export default {
  components: {
    FoodImg
  },
  props: {
    name: {
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
  <router-link class="card" :to="{
    name: 'food',
    params: {
      name: name,
    },
    query: {
      id: id
    }
  }">
    <div class="position-relative">
      <FoodImg class="position-absolute img" :id="id" :name="name" :height="50"></FoodImg>
      <h1>{{ name }}</h1>
    </div>
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

.img {
  left: 0px;
}
</style>