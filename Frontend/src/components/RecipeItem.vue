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
    <div v-if="techniquesList.length == 0">
        <SpinnerComponent class="mx-auto p-2" />
    </div>
    <div class="position-relative">
        <div class="row">
            <div class="col">
                {{ title.replace(/\b\w/g, x => x.toUpperCase()) }}
            </div>
            <div class="col">
                <div v-if="techniquesList.length != 0">
                    <div v-for="technique in techniquesList" class="">
                        <TechniqueIcon :active=technique.valueOf()></TechniqueIcon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>