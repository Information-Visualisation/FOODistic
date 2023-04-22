<script lang="ts">
import FoodItem from '../components/FoodItem.vue';
import SpinnerComponent from './SpinnerComponent.vue';
import { DBService } from '../services/db.service';
import { GET_FOOD_FOR_NAME, GET_FOODCOUNT_FOR_NAME } from '@/services/queries';
import FoodGroup from '@/views/FoodGroup.vue';


export default {
    components: {
        FoodItem,
        SpinnerComponent,
    },
    props: {
        foodName: {type: String, default: ""},
        allergy: {type: String, default: ""},
        group: {type: String, default: ""},
        subgroup: {type: String, default: ""},
        offset: {type: Number, default: 0},
        comparing: {type: Boolean, default: false},
    },
    data() {
        return {
            fooditems: null,
            totalCount: 0,
            pageSize: 24,
        }
    },
    async created() {
        this.query();
    },
    emits: ["compare"],
    methods: {
        async query() {
            const dbService = new DBService;
            const query = GET_FOOD_FOR_NAME(this.foodName, this.allergy, this.group, this.subgroup, this.offset);
            this.fooditems = await dbService.query(query);
            this.fooditems = this.fooditems.rows;
            this.totalCount = await dbService.query(GET_FOODCOUNT_FOR_NAME(this.foodName));
            this.totalCount = parseInt(this.totalCount.rows[0].c);
        },
        compare(event: any, id: String) {
            this.$emit('compare', null, id);
        }
    },
    watch: {
        foodName(newV, oldV) {
            this.query();
        },
        allergy(newV, oldV) {
            this.query();
        },
        group(newV, oldV) {
            this.query();
        },
        subgroup(newV, oldV) {
            this.query();
        }
    }
}
</script>
<template>
    <div class="container vstack">

        <div v-if="fooditems === null" class="justify-content-center">
            <SpinnerComponent />
        </div>
        <div v-if="fooditems !== null">
            <div v-if="fooditems.length == 0">No results found</div>
            <FoodItem v-for="fooditem in fooditems" :name=fooditem.naam :id="fooditem.id.toString()"
                :comparing="comparing" @compare="compare"></FoodItem>
        </div>

        <nav v-if="totalCount>=1" aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li v-for="(n,index) in 5" class="page-item"><a class="page-link" href="#">{{ index+1 }}</a></li>
                TODO: perhaps make pagination
            </ul>
        </nav>


    </div>
</template>

<style></style>