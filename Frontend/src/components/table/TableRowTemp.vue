<script lang="ts">
export default {
  props: {
    items: Array<string | number>
  },
  computed: {
    name() {
      return this.items?.[0];
    },
    columns() {
      return this.items?.slice(1);
    }
  }
}
</script>
<template>
    <tr>
    <th @click="$router.push({ name: 'food', params : { name: name } })">{{name}}</th>
    <td v-for="item in columns">{{item}}</td>
    </tr>
</template>