<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>
<template>
    <tr>
    <th scope="col" v-for="item in items">{{ item }}</th>
    </tr>
</template>