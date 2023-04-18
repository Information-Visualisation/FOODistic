<script lang="ts">
import SpinnerComponent from '@/views/SpinnerComponent.vue';
import TechniqueIcon from './TechniqueIcon.vue';

export default {
    props: {
        title: {
            type: String,
            required: true
        },
        techniques: {
            type: String,
            required: true
        }
    },
    components: {
        TechniqueIcon,
        SpinnerComponent
    },
    created() {
        //console.log(this.techniques);
        this.techniquesList = this.formatBooleanString(this.techniques);
        //console.log(this.techniquesList);
    },
    data() {
        return {
            isLoading: true,
            techniquesList: new Array<Boolean>(),
        }
    },
    methods: {
        formatBooleanString(str: String): Array<Boolean> {
            return str.slice(1, -1).replace(/\s/g, '').split(',').map(x => x === '1');
        }
    }
}
</script>

<template>
    <div class="card">
        {{ title }}
        <div v-if="techniquesList.length == 0">
            <SpinnerComponent />
        </div>
        <div v-else="techniquesList.length!=0" class="center">
            <div v-for="technique in techniquesList" class="flexbox">
                <TechniqueIcon :active=technique.valueOf()></TechniqueIcon>
            </div>
        </div>
    </div>
</template>

<style>
.card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: 100%;
    margin: 10px;
    text-align: center;
    font-family: arial;
    float: left;
}
.center {
    margin: auto
}
.flexbox {
    display: flex;
}
</style>