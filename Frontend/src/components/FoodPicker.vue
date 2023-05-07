<script lang="ts">
import FoodItem from '../components/FoodItem.vue';
import SpinnerComponent from './SpinnerComponent.vue';
import { DBService } from '../services/db.service';
import { GET_FOOD_FOR_NAME, GET_FOODCOUNT_FOR_NAME } from '@/services/queries';

const dbService = new DBService;

export default {
    components: {
        FoodItem,
        SpinnerComponent,
    },
    props: {
        name: {type: String, default: ""},
        allergies: {type: Array<String>, default: ""},
        group: {type: String, default: ""},
        subgroup: {type: String, default: ""},
        offset: {type: Number, default: 0},
        comparing: {type: Boolean, default: false},
    },
    data() {
        return {
            isLoading: true,
            fooditems: null,
            totalCount: 0,
            pageSize: 24,
        }
    },
    async created() {
        this.getFoodFromAllergies()
        this.query();
    },
    emits: ["compare", "returnFooditems"],
    methods: {
        async query() {
            this.isLoading = true;
            const allergies = await this.getFoodFromAllergies();
            this.fooditems = await dbService.query(GET_FOOD_FOR_NAME(this.name, allergies, this.group, this.subgroup, this.offset));
            this.fooditems = this.fooditems.rows;
            this.totalCount = await dbService.query(GET_FOODCOUNT_FOR_NAME(this.name, allergies, this.group, this.subgroup));
            this.totalCount = parseInt(this.totalCount.rows[0].c);
            this.returnFooditems();
            this.isLoading = false;
        },
        async getFoodFromAllergies(){
            let resultAllergy = this.changeArrayToString(this.allergies);
            let allergyFoodResultQuery = await dbService.query(`SELECT food FROM allergies WHERE allergy in ` + resultAllergy);
            allergyFoodResultQuery = allergyFoodResultQuery.rows;
            let allergyFood = []  as string[];
            for (var food in allergyFoodResultQuery) {
                allergyFood.push(food.food);
            }
            return allergyFood
        },
        changeArrayToString(convert: any){
            let allergyInString = "('";
            if (convert != "") {
              for (let i = 0; i < convert.length; i++) {
                if (i + 1 != convert.length)
                    allergyInString += convert[i] + "', '";
                else
                    allergyInString += convert[i];
              }
            }
            allergyInString += "')";
            return allergyInString;
        },
        compare(event: any, id: String) {
            this.$emit('compare', null, id);
        },
        returnFooditems() {
            this.$emit('returnFooditems', null, this.fooditems, this.totalCount);
        }
    },
    watch: {
        name(newV, oldV) {
            this.query();
        },
        allergies(newV, oldV) {
            this.query();
        },
        group(newV, oldV) {
            this.query();
        },
        subgroup(newV, oldV) {
            this.query();
        },
        offset(newV, oldV) {
            this.query();
        }
    }
}
</script>
<template>
    <div class="container vstack">

        <div v-if="fooditems === null || isLoading" class="justify-content-center">
            <SpinnerComponent />
        </div>
        <div v-if="fooditems !== null && !isLoading">
            <div v-if="fooditems.length == 0">No results found</div>
            <FoodItem v-for="fooditem in fooditems" :name=fooditem.naam :id="fooditem.id.toString()"
                :comparing="comparing" @compare="compare"></FoodItem>
        </div>

    </div>
</template>

<style></style>