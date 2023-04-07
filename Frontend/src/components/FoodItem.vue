<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
    <div class="card">
        <h1>{{ title }}</h1>
    </div>
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