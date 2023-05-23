<script lang="ts">
import SpinnerComponent from './SpinnerComponent.vue';
import FoodImg from './FoodImg.vue';
import { DBService } from '@/services/db.service';
import type { FoodRow } from '@/services/dbClasses';
import { GET_ALLERGY_FOR, GET_FOOD_FOR_ID } from '@/services/queries';

const dbService = new DBService;

export default {
    props: {
        foodNum: {
            type: Number,
            required: true,
        },
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
        },
        isMinimized: {
            type: Boolean,
            required: true,
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
        },
        focusDataset() {
            this.$emit('focusDataset', null, this.foodNum-1);
        },
        unfocusDataset() {
            this.$emit('unfocusDataset', null);
        },
        makeMain() {
            this.$router.push({
                name: 'food',
                params: {
                    name: this.$route.params.name,
                },
                query: {
                    id: this.id,
                }
            });
        },
    },
    emits: ["deletePicked", "focusDataset", "unfocusDataset"]
}
</script>

<template>
    <div v-if="loading">
        <SpinnerComponent></SpinnerComponent>
    </div>
    <a :href="$router.resolve({
            name: 'food',
            params: {
                name: name,
            },
            query: {
                id: id
            }
        }).href" v-if="!loading && !isMinimized"
        :class="'rounded-pill tag '+(foodNum == 0 ? 'btn-outline-success' : ' btn-outline-food' + foodNum.toString()) + ' btn'"
        @mouseover="focusDataset" @mouseleave="unfocusDataset">
        <div class="row flex-nowrap align-items-center ">
            <div class="col nopadmarg position-relative imgDiv">
                <div :class="'foodBorder rounded-circle food' + foodNum.toString()"></div>
                <FoodImg class="image position-absolute foodImg" :id="id" :name="name" :height="80"></FoodImg>
            </div>
            <div class="col col-md-auto nopadmarg">
                <div class="nopadmarg">
                    <h1 class="title">{{ name }}</h1>
                    {{ scientific_name }}
                </div>
                <div class="row">
                    <div v-if="Object.keys(allergies).length > 0">
                        <div v-for="allergy in allergies">
                            <img :title=allergy.allergy :src="getImageUrl(allergy.allergy)" style="width: 50px" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col tagCol1 nopadmarg">
                <button v-if="allowClose" type="button" class="btn-close" aria-label="Close" @click="deletePicked"></button>
                <!-- <div v-if="!allowClose" class="main">main</div> -->
            </div>
        </div>
    </a>
    <button v-if="!loading && isMinimized" @mouseover="focusDataset" @mouseleave="unfocusDataset" :class="'flexMinimized rounded-pill tag ' +(foodNum == 0 ? 'btn-outline-success' : ' btn-outline-food' + foodNum.toString())
        + ' btn'" @click="">
        {{ name }}
        <button v-if="allowClose" type="button" class="btn-close ms-1" aria-label="Close" @click="deletePicked"></button>
        <div v-if="!allowClose" class="main ms-1">main</div>
    </button>
</template>

<style>
/*TODO: How to get the colors here working? I tried to do it like Lise and I couldn't get it to work :c */

/* $food1: #8DD3C7;
$food2: #FB8072;
$food3: #BEBADA;
$food4: #b5b575;
$food4light: FCFC74;
$food5: #80B1D3; */

.food0 {
    background-color: #73A525;
}

.btn-outline-food1 {
    --bs-btn-color: #8DD3C7;
    --bs-btn-border-color: #8DD3C7;
    --bs-btn-hover-color: #000;
    --bs-btn-hover-bg: #8DD3C7;
    --bs-btn-hover-border-color: #8DD3C7;
    --bs-btn-focus-shadow-rgb: 115, 165, 37;
    --bs-btn-active-color: #000;
    --bs-btn-active-bg: #8DD3C7;
    --bs-btn-active-border-color: #8DD3C7;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #8DD3C7;
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: #8DD3C7;
    --bs-gradient: none;
}

.food1 {
    background-color: #8DD3C7;
}

.btn-outline-food2 {
    --bs-btn-color: #FB8072;
    --bs-btn-border-color: #FB8072;
    --bs-btn-hover-color: #000;
    --bs-btn-hover-bg: #FB8072;
    --bs-btn-hover-border-color: #FB8072;
    --bs-btn-focus-shadow-rgb: 115, 165, 37;
    --bs-btn-active-color: #000;
    --bs-btn-active-bg: #FB8072;
    --bs-btn-active-border-color: #FB8072;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #FB8072;
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: #FB8072;
    --bs-gradient: none;
}

.food2 {
    background-color: #FB8072;
}

.btn-outline-food3 {
    --bs-btn-color: #BEBADA;
    --bs-btn-border-color: #BEBADA;
    --bs-btn-hover-color: #000;
    --bs-btn-hover-bg: #BEBADA;
    --bs-btn-hover-border-color: #BEBADA;
    --bs-btn-focus-shadow-rgb: 115, 165, 37;
    --bs-btn-active-color: #000;
    --bs-btn-active-bg: #BEBADA;
    --bs-btn-active-border-color: #BEBADA;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #BEBADA;
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: #BEBADA;
    --bs-gradient: none;
}

.food3 {
    background-color: #BEBADA;
}

.btn-outline-food4 {
    --bs-btn-color: #b5b575;
    --bs-btn-border-color: #b5b575;
    --bs-btn-hover-color: #000;
    --bs-btn-hover-bg: #FCFC74;
    --bs-btn-hover-border-color: #FCFC74;
    --bs-btn-focus-shadow-rgb: 115, 165, 37;
    --bs-btn-active-color: #000;
    --bs-btn-active-bg: #FCFC74;
    --bs-btn-active-border-color: #FCFC74;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #FCFC74;
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: #FCFC74;
    --bs-gradient: none;
}

.food4 {
    background-color: #FCFC74;
}

.btn-outline-food5 {
    --bs-btn-color: #80B1D3;
    --bs-btn-border-color: #80B1D3;
    --bs-btn-hover-color: #000;
    --bs-btn-hover-bg: #80B1D3;
    --bs-btn-hover-border-color: #80B1D3;
    --bs-btn-focus-shadow-rgb: 115, 165, 37;
    --bs-btn-active-color: #000;
    --bs-btn-active-bg: #80B1D3;
    --bs-btn-active-border-color: #80B1D3;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #80B1D3;
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: #80B1D3;
    --bs-gradient: none;
}

.food5 {
    background-color: #80B1D3;
}

.tag {
    margin: 5px;
}

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

.flexMinimized {
    display: flex;
    flex-wrap: nowrap;
}

.foodImg {
    top: 0;
    left: 0;
}

.foodBorder {
    width: 100px;
    height: 100px;
    top: 0;
    left: 0;
}

.imgDiv {
    margin: 10px;
}
</style>