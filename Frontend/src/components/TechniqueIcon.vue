<script lang="ts">
export default {
    props: {
        active: {
            type: Boolean,
            required: true
        },
        techniqueProp: {
            type: String,
            required: false
        }
    },
    constructor() {
        //this.technique = this.formatTechnique(this.techniqueProp) as string;
    },
    data() {
        return {
            technique: "",
        }
    },
    methods: {
        formatTechnique(str: String): String {
            switch (str) {
                case "":
                    return "";
                default:
                    return "";
            }
        }
    }
}
</script>

<template>
    <div v-if="active">
        <div class="box circle float"></div>
    </div>
    <!-- <div v-else="!active">
        <div class="box"></div>
    </div> -->
</template>

<style>
.box {
    width: 10px;
    height: 10px;
    font-family: arial;
}

.circle {
    background-color: #111111;
    border-radius: 50%;
}

.float {
    float: right;
}
</style>