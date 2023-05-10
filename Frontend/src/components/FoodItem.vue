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
    },
    comparing: {
      type: Boolean,
      default: false,
    }
  },
  emits: ["compare"],
  methods: {
    compare(event: any) {
      this.$emit('compare', null, this.id)
    }
  }
}
</script>

<template>
  <button v-if="comparing" class="card small btn btn-outline-success" @click="compare">
    <div class="d-flex align-items-center justify-content-start">
      <FoodImg class="img" :id="id" :name="name" :height="50"></FoodImg>
      <h3 class="food-name text-truncate">{{ name }}</h3>
    </div>
  </button>
  <router-link v-if="!comparing" class="card normal btn btn-outline-success" :to="{
    name: 'food',
    params: {
      name: name,
    },
    query: {
      id: id
    }
  }">
    <div class="d-flex align-items-center justify-content-start">
      <FoodImg class="img" :id="id" :name="name" :height="50"></FoodImg>
      <span class="food-name text-truncate">{{ name }}</span>
    </div>
  </router-link>
</template>

<style scoped>
.normal {
  width: 31%;
  height: 70px;
}

.small {
  width: 45%;
  height: 70px;
}

.smallTitle {
  top: 5px;
  left: 50px;
  width: 200px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: 10px;
  text-align: center;
  font-family: arial;
  float: left;
}

.img {
  margin-right: 10px;
}

.food-name {
  font-weight: bold;
  font-size: x-large;
}
</style>