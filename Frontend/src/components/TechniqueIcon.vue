<script lang="ts">

export default {
    props: {
        technique: {
            type: String,
            required: false
        }
    },
}
</script>

<template>
    <div class="float">
        <img class="box" :src="'/src/assets/cookingtechniques/' + technique + '.png'" />
    </div>
</template>

<style>
.box {
    width: 20px;
    height: 20px;
    margin: 0 3px 0 3px;
    font-family: arial;
}

.circle {
    background-color: #111111;
    border-radius: 50%;
}

.float {
    float: right;
}</style>