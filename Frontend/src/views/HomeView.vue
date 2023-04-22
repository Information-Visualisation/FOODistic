<script lang="ts">
import { stringifyExpression } from '@vue/compiler-core';
import FoodItem from '../components/FoodItem.vue'
import { DBService } from '../services/db.service'
import type { Rows, Row} from '../services/db.service';
import type AppVue from '@/App.vue';

const dbService = new DBService;
export default {
  components: {
    FoodItem,
  },
  data() {
    return {
      isLoading: true,
      result_foodGroup: null as unknown as Rows,
      foodGroupitems: null as unknown as Rows,
      result_food: null as unknown as Rows,
      fooditems: null as unknown as Rows,
      selectedFoodGroup: 'All',
      selectedSubFoodGroup: 'All',
      allergy: "",
      foodSubGroupitems: null as unknown as Rows,
    }
  },
  created: function () {
    let result1 = this.changeParamString(this.$route.params.allergy)
    this.changeAllergy(result1)
    this.queryALL().then(() => {
      this.setResultQuery();
    })
    ;
  },
  methods:{
    async queryALL(){
      this.result_foodGroup = await dbService.query(`SELECT DISTINCT food_group FROM food WHERE food_group is NOT NULL`);
      if(this.allergy == "")
        this.result_food = await dbService.query(`SELECT id,naam FROM food LIMIT 40`);
      else
        this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE naam not in `+ this.allergy +` LIMIT 40`);
     this.$nextTick(() => {
        this.loaded();
      })
    },
    loaded() {
      this.isLoading = false;
    },
    setResultQuery(){
      this.fooditems = this.result_food;
      this.foodGroupitems = this.result_foodGroup;
    },
    goToPage(pagename: any, nameFood?: any){
      this.$router.push({ name: pagename, params : { name: nameFood } })
    },
    setSelectedItem(foodgroup: any){
      this.selectedFoodGroup = foodgroup;
      this.selectedSubFoodGroup = 'All';
      this.isLoading = true;
      this.queryFoodGroup().then(() => {
        this.setResultQuery();
      });
    },
    setSelecteSubFooddItem(foodsubgroup: any){
      this.selectedSubFoodGroup = foodsubgroup;
      this.isLoading = true;
      this.querySubFoodGroup().then(() => {
        this.setResultQuery();
      });
    },
    async queryFoodGroup(){
      if (this.selectedFoodGroup == 'All'&& this.allergy == "('')")
          this.result_food = await dbService.query(`SELECT id,naam FROM food LIMIT 40`);
      else{
        if (this.selectedFoodGroup == 'All')
          this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE naam not in `+ this.allergy +` LIMIT 40`);
        else{
          console.log(this.allergy)
          if(this.allergy == "('')"){
            this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE food_group = '`+this.selectedFoodGroup+`'`);
          }else{
            this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE naam not in `+ this.allergy +` AND food_group = '`+this.selectedFoodGroup+`'`);
          }
          this.foodSubGroupitems = await dbService.query(`SELECT DISTINCT food_subgroup FROM food WHERE food_group = '`+this.selectedFoodGroup+`' AND food_subgroup is NOT NULL`);
          console.log(this.foodSubGroupitems)
        }  
      }
      this.$nextTick(() => {
        this.loaded();
      })
    },
    async querySubFoodGroup(){
      if (this.selectedFoodGroup == 'All'&& this.selectedSubFoodGroup == 'All'&& this.allergy == "('')")
          this.result_food = await dbService.query(`SELECT id,naam FROM food LIMIT 40`);
      else{
        if (this.selectedFoodGroup == 'All' && this.selectedSubFoodGroup == 'All')
          this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE naam not in `+ this.allergy +` LIMIT 40`);
        else{
          if(this.allergy == "('')"){
            this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE food_group = '`+this.selectedFoodGroup+`' AND food_subgroup = '`+this.selectedSubFoodGroup+`'`);
          }else{
            this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE naam not in `+ this.allergy +` AND food_group = '`+this.selectedFoodGroup+`' AND food_subgroup = '`+this.selectedSubFoodGroup+`'`);
          }
        }  
      }
      this.$nextTick(() => {
        this.loaded();
      })
    },
    async changeAllergy(allergie: string){
      let result = [] as string[]
      let result2 = await dbService.query(`SELECT food FROM allergies WHERE allergy in ` + allergie)
      
      for(var val2 of result2){
        result.push(val2.food)
      }
      this.allergy = this.changeParamString(result)
    },
    changeParamString(params: string | any[] | undefined){
      let string = "('";
      if(params != undefined){
        for(let i = 0; i < params.length; i++){
          if (i+1 != params.length)
              string += params[i] +"', '"
            else
            string += params[i]
        }
      }
      string += "')"
      return string
    }
  }
}

</script>

<template>
  <main>
    <div>
      <div class="position-relative" v-if="isLoading">
          <p>is loading</p>
      </div>
      <div class="container" v-else="!isLoading">
        <div>
          <h1>Food group:</h1>
          <div class="btn-group">
            <button type="button" class="btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{{selectedFoodGroup}}</button>
            <ul class="dropdown-menu">
              <li class="dropdown-item" @click="setSelectedItem('All')">All foodgroups</li>
              <li class="dropdown-item" v-for="foodGroupitem in foodGroupitems" @click="setSelectedItem(foodGroupitem.food_group)">{{foodGroupitem.food_group}}</li>
            </ul>
          </div>
          <div v-if="selectedFoodGroup != 'All'">
            <h2>Food subgroup:</h2>
            <div class="btn-group">
              <button type="button" class="btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{{selectedSubFoodGroup}}</button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" @click="setSelectedItem('All')">All foodsubgroups</li>
                <li class="dropdown-item" v-for="foodSubGroupitem in foodSubGroupitems" @click="setSelecteSubFooddItem(foodSubGroupitem.food_subgroup)">{{foodSubGroupitem.food_subgroup}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h1>Food:</h1>
          <FoodItem v-for="fooditem in fooditems" :title=fooditem.naam @click="goToPage('food',fooditem.naam)"> <!-- change to goToFoodPage(fooditem.id) --></FoodItem>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.container {
 padding: 40px;
}
.dropdown-item:hover{
    background-color:red;
 }
 .dropdown-menu {
    max-height: 280px;
    overflow-y: auto;
}
</style>
