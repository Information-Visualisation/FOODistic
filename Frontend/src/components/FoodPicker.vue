<script lang="ts">
import FoodItem from '../components/FoodItem.vue';
import SpinnerComponent from './SpinnerComponent.vue';
import { DBService } from '../services/db.service';
import { GET_FOOD_FOR_NAME, GET_FOODCOUNT_FOR_NAME } from '@/services/queries';


export default {
    components: {
        FoodItem,
        SpinnerComponent,
    },
    props: {
        foodName: {
            type: String,
            default: ""
        },
        offset: {
            type: Number,
            default: 0
        },
        comparing: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            fooditems: null,
            totalCount: 0,
            pageSize: 24,
        }
    },
    async created() {
        this.query(this.foodName, this.offset);
    },
    emits: ["compare"],
    methods: {
        async query(foodName: string, offset: number) {
            const dbService = new DBService;
            this.fooditems = await dbService.query(GET_FOOD_FOR_NAME(foodName, offset));
            this.totalCount = await dbService.query(GET_FOODCOUNT_FOR_NAME(foodName));
            this.totalCount = parseInt(this.totalCount.rows[0].c);
        },
        compare(event: any, id: String) {
            this.$emit('compare', null, id);
        }
    },
    watch: {
        foodName(newV, oldV) {
            this.query(newV, this.offset);
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
            <div v-if="fooditems.rows.length == 0">No results found</div>
            <FoodItem v-for="fooditem in fooditems.rows" :name=fooditem.naam :id="fooditem.id.toString()"
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