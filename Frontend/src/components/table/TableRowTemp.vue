<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>
<template>
    <tr>
    <th @click="$router.push({ name: 'food', params : { name: 'apple' } })">{{items[0]}}</th>
    <td v-for="item in items.splice(1,items.length)">{{item}}</td>
    </tr>
</template>