<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
<template>
    <li><div class="form-check">
    <input class="form-check-input" type="checkbox" value="Action" id="flexCheckDefault">
    <label class="form-check-label" for="flexCheckDefault">
        {{ title }}
    </label>
    </div></li>
</template>