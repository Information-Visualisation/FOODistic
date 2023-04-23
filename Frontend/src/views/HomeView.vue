<script lang="ts">
import FoodItem from '../components/FoodItem.vue'
import { DBService } from '../services/db.service'
import FoodPicker from '../components/FoodPicker.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';

const dbService = new DBService;
export default {
  components: {
    FoodItem,
    FoodPicker,
    SpinnerComponent
  },
  data() {
    return {
      isLoading: true,
      fooditems: null,
      foodGroupitems: null,
      foodSubGroupitems: null,
      filteritems: null,

      foodName: this.$route.query.search !== undefined ? this.$route.query.search as string : "",
      allergies: this.$route.query.allergies !== undefined ? this.makeArray() : [],
      foodGroup: this.$route.query.foodgroup !== undefined ? this.$route.query.foodgroup as string : "All",
      subFoodGroup: this.$route.query.subfoodgroup !== undefined ? this.$route.query.subfoodgroup as string : "All",
      offset: this.$route.query.offset !== undefined ? parseInt(this.$route.query.offset as string) : 0,

    }
  },
  created: function () {
    // let result1 = this.changeParamString(this.$route.params.allergy)
    // this.changeAllergy(result1)
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.foodGroupitems = await dbService.query(`SELECT DISTINCT food_group FROM food WHERE food_group is NOT NULL`);
      this.foodGroupitems = this.foodGroupitems.rows;
      this.fetchAllergies();
      this.fetchSubFoodGroups();
      this.loaded();
    },
    async fetchSubFoodGroups() {
      if (this.foodGroup != 'All' && this.foodGroup != '') {
        this.foodSubGroupitems = await dbService.query(`SELECT DISTINCT food_subgroup FROM food WHERE food_group = '` + this.foodGroup + `' AND food_subgroup is NOT NULL`);
        this.foodSubGroupitems = this.foodSubGroupitems.rows;
      }
    },
    makeArray() {
      if (typeof this.$route.query.allergies === 'string') {
        return new Array(this.$route.query.allergies as string);
      }
      return this.$route.query.allergies as Array<string>;
    },
    loaded() {
      this.isLoading = false;
    },
    async setFoodgroup(foodgroup: any) {
      this.isLoading = false;
      this.foodGroup = foodgroup;
      this.subFoodGroup = 'All';
      this.fetchSubFoodGroups();
      this.route()
      this.loaded();
    },
    setSubFoodGroup(foodsubgroup: any) {
      this.isLoading = false;
      this.subFoodGroup = foodsubgroup;
      this.route();
      this.loaded();
    },
    route() {
      let options = { name: 'home', query: {} };
      if (this.foodName != '')
        options.query.search = this.foodName;
      if (this.allergies.length != 0)
        options.query.allergies = this.allergies;
      if (this.foodGroup != 'All')
        options.query.foodgroup = this.foodGroup;
      if (this.subFoodGroup != 'All')
        options.query.subfoodgroup = this.subFoodGroup;
      if (this.offset)
        options.query.offset = this.offset;

      this.$router.push(options);
    },
    // async changeAllergy(allergy: string) {
    //   let result = [] as string[];
    //   let result2 = await dbService.query(`SELECT food FROM allergies WHERE allergy in ` + allergy);
    //   result2 = result2.rows;

    //   for (var val2 of result2) {
    //     result.push(val2.food);
    //   }
    //   this.allergy = this.changeParamString(result);
    // },
    // changeParamString(params: string | any[] | undefined) {
    //   let string = "('";
    //   if (params != undefined) {
    //     for (let i = 0; i < params.length; i++) {
    //       if (i + 1 != params.length)
    //         string += params[i] + "', '";
    //       else
    //         string += params[i];
    //     }
    //   }
    //   string += "')"
    //   return string
    // },
    async fetchAllergies() {
      this.filteritems = await dbService.query("SELECT DISTINCT allergy FROM allergies WHERE allergy IS NOT NULL;");
      this.filteritems = this.filteritems.rows;
    },
  }
}
</script>

<template>
  <main>
    <div>
      <div class="position-relative" v-if="isLoading">
        <SpinnerComponent></SpinnerComponent>
      </div>

      <div class="container" v-if="!isLoading">
        <div class="d-flex justify-content-center" role="search">
          <!-- <input class="form-control me-2 focus-ring-danger" type="search" placeholder="Search" aria-label="Search"
            name="search" v-model="search"> -->

          <div>
            <!-- <h4>Food Group:</h4> -->
            <div class="btn-group">
              <button type="button" class="btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown"
                aria-expanded="false">{{ foodGroup }}</button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" @click="setFoodgroup('All')">All</li>
                <li class="dropdown-item" v-for="foodGroupitem in foodGroupitems"
                  @click="setFoodgroup(foodGroupitem.food_group)">{{ foodGroupitem.food_group }}</li>
              </ul>
            </div>
            <div v-if="foodGroup != 'All'">
              <!-- <h4>Food Subgroup:</h4> -->
              <div class="btn-group">
                <button type="button" class="btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown"
                  aria-expanded="false">{{ subFoodGroup }}</button>
                <ul class="dropdown-menu">
                  <li class="dropdown-item" @click="setSubFoodGroup('All')">All</li>
                  <li class="dropdown-item" v-for="foodSubGroupitem in foodSubGroupitems"
                    @click="setSubFoodGroup(foodSubGroupitem.food_subgroup)">{{ foodSubGroupitem.food_subgroup }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="btn-group">
                <button type="button" class="btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Filter
                </button>
                <ul class="dropdown-menu">
                  <li v-for="filteritem in filteritems">
                    <div class="form-check">
                      <input type="checkbox" :value="filteritem.allergy" :id="filteritem.allergy" name="alergies"
                        v-model="allergies" @change="route" :checked="allergies.indexOf(filteritem.allergy) != -1" />
                      <label :for="filteritem.allergy">
                        {{ filteritem.allergy }}
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <input v-model="foodName" class="form-control me-2 height width" type="search" name="foodName"
            placeholder="Search" aria-label="Search" @keyup.enter="route" @blur="route">
          <div @click="route" class="btn btn-outline-success height">Search</div>
          <!-- <button class="btn btn-outline-danger" type="submit" @click="searchSubmit">Search</button> -->
        </div>
        <div class="">
          <FoodPicker :foodName="foodName" :group="foodGroup" :subgroup="subFoodGroup" :offset="offset" :allergy="allergies"></FoodPicker>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.container {
  padding: 40px;
}

.height {
  height: 40px;
}

.width {
  width: 50%;
}

.dropdown-item:hover {
  background-color: red;
}

.dropdown-menu {
  max-height: 280px;
  overflow-y: auto;
}
</style>
