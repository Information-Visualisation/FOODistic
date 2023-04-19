<script setup lang="ts">
defineProps<{
  percents: number[]
}>()
</script>
<template>
    <tr>
    <th scope="col"></th> <!-- First one should be empty-->
    <th scope="col" v-for="percent in percents">
        <div class="bar-wrapper">
            <span class="bar-percentage">{{ percent }}</span>
            <div class="bar">
            </div>
        </div>
    </th>
    </tr>
</template>

<style>

.bar-wrapper {
    height: 120px;
    width: 50px;
}

.bar-percentage {
    height: 20px;
}

.bar {
    height: 80px;
    background-color: brown;
}

</style>