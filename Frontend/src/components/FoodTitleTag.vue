<script lang="ts">
import SpinnerComponent from './SpinnerComponent.vue';
import FoodImg from './FoodImg.vue';
import { DBService } from '@/services/db.service';
import type { FoodRow } from '@/services/dbClasses';
import { GET_ALLERGY_FOR, GET_FOOD_FOR_ID } from '@/services/queries';

const dbService = new DBService;

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
        allowClose: {
            type: Boolean,
            default: true
        }
    },
    components: {
        FoodImg,
        SpinnerComponent
    },
    data() {
        return {
            row: {} as FoodRow,
            scientific_name: "",
            foodGroup: "",
            subFoodGroup: "",
            allergies: {} as { [key: number]: { allergy: string } },
            loading: false,
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            this.loading = true;
            this.row = (await dbService.query(GET_FOOD_FOR_ID(this.id))).rows[0];
            this.setFoodGroups();
            // console.log(this.name);
            this.allergies = (await dbService.query(GET_ALLERGY_FOR(this.name))).rows;
            this.loading = false;
        },
        setFoodGroups() {
            this.foodGroup = this.row.food_group;
            this.subFoodGroup = this.row.food_subgroup;
            this.scientific_name = this.row.naam_scientific;
        },
        getImageUrl(allergy: string) {
            if (allergy.includes('Lactose')) {
                return new URL(`../assets/allergies/Lactose intolerance.png`, import.meta.url).href;
            }
            let url: string = new URL(`../assets/allergies/${allergy}.png`, import.meta.url).href;
            return url.includes('undefined') ? new URL(`../assets/allergies/checkbox.png`, import.meta.url).href : url;
        },
        deletePicked() {
            this.$emit('deletePicked', null, this.id);
        }
    },
    emits: ["deletePicked"]
}
</script>

<template>
    <div v-if="loading"><SpinnerComponent></SpinnerComponent></div>
    <button v-if="!loading" class="card tag">
        <div class="row flex-nowrap">
            <div class="col nopadmarg align-self-center">
                <FoodImg class="image" :id="id" :name="name" :height="80"></FoodImg>
            </div>
            <div class="col col-md-auto nopadmarg align-self-center">
                <div class="nopadmarg">
                    <h1 class="title">{{ name }}</h1>
                    {{ scientific_name }}
                </div>
            </div>
            <div class="col tagCol1 nopadmarg">
                <button v-if="allowClose" type="button" class="btn-close" aria-label="Close" @click="deletePicked"></button>
                <div v-if="!allowClose" class="main">main</div>
            </div>
        </div>
        <!-- <div v-if="Object.keys(allergies).length >= 1">
            <div v-for="allergy in allergies">
                <img :title=allergy.allergy :src="getImageUrl(allergy.allergy)" style="width: 50px" />
            </div>
        </div> -->
    </button>
</template>

<style>

.tagCol1 {
    width: 3rem
}

.main {
    color: lightgray;
}

.nopadmarg {
    padding: 0px;
    margin: 0px;
}


.title {
    padding-left: 0px;
}
</style>