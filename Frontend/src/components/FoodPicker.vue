<script lang="ts">
import FoodItem from '../components/FoodItem.vue';
import SpinnerComponent from './SpinnerComponent.vue';
import { DBService } from '../services/db.service';
import { GET_FOOD_FOR_NAME, GET_FOODCOUNT_FOR_NAME } from '@/services/queries';
import type { FoodRow } from '@/services/dbClasses';

const dbService = new DBService;

export default {
    components: {
        FoodItem,
        SpinnerComponent,
    },
    props: {
        name: { type: String, default: "" },
        allergies: { type: Array<String>, default: [] },
        group: { type: String, default: "" },
        subgroup: { type: String, default: "" },
        offset: { type: Number, default: 0 },
        pageSize: { type: Number, default: 24 },
        comparing: { type: Boolean, default: false },
    },
    data() {
        return {
            isLoading: true,
            fooditems: [] as FoodRow[],
            totalCount: 0,
        }
    },
    async created() {
        //this.getFoodFromAllergies();
        this.query();
    },
    emits: ["compare", "returnFooditems"],
    methods: {
        async query() {
            this.isLoading = true;
            const allergies = await this.getFoodFromAllergies();
            let tempFooditems;
            try {
                tempFooditems = await dbService.query(GET_FOOD_FOR_NAME(this.name, allergies, this.group, this.subgroup, this.offset, this.pageSize));
            } catch (e) {
                tempFooditems = undefined;
            }
            if (tempFooditems !== undefined) {
                this.fooditems = tempFooditems.rows;
                let tempTotalCount = await dbService.query(GET_FOODCOUNT_FOR_NAME(this.name, allergies, this.group, this.subgroup));
                this.totalCount = parseInt(tempTotalCount.rows[0].c);
                this.returnFooditems();
            }
            this.isLoading = false;
        },
        async getFoodFromAllergies() {
            let resultAllergy = this.changeArrayToString(this.allergies);
            let allergyFoodResultQuery: {food: string}[]  = (await dbService.query(`SELECT food FROM allergies WHERE allergy in ` + resultAllergy)).rows;
            let allergyFood = [] as string[];
            for (var food of allergyFoodResultQuery) {
                allergyFood.push(food.food);
            }
            return allergyFood
        },
        changeArrayToString(convert: any) {
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
        },
        pageSize(newV, oldV) {
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
        <div v-if="fooditems === undefined">No results found</div>
        <div v-if="fooditems !== null && fooditems !== undefined && !isLoading">
            <div v-if="fooditems.length == 0">No results found</div>
            <FoodItem v-for="fooditem in fooditems" :name=fooditem.naam :id="fooditem.id.toString()" :comparing="comparing"
                @compare="compare"></FoodItem>
        </div>

    </div>
</template>

<style></style>