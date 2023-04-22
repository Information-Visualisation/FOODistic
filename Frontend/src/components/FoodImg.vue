<script lang="ts">
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        height: {
            type: Number,
            default: 80,
        }
    },
    methods: {
        getImage() : string {
            return 'https://foodb.ca/system/foods/pictures/' + this.id + '/full/' + this.id + '.png?1334914197';
        },
        getAlt() : string {
            return this.name;
        }
    },
    computed: {
        cssProps() {
            return {
                '--height': (this.height) + "px"
            }
        }
    }
}
</script>

<template>
    <img :style="cssProps" class="img" :src="getImage()" :alt="getAlt()">
</template>

<style>
.img {
  height: var(--height);
  width: var(--height);
  object-fit: cover;
  border-radius: 50%;
}
</style>