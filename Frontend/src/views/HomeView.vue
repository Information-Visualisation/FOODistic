<script lang="ts">
import FoodItem from '../components/FoodItem.vue'
import { DBService } from '../services/db.service'
import FoodPicker from '../components/FoodPicker.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import FoodTable from '@/components/table/FoodTable.vue';

const MAX_PAGINATION: number = 10;
const PAGE_SIZE: number = 24;

const dbService = new DBService;
export default {
  components: {
    FoodItem,
    FoodPicker,
    SpinnerComponent,
    FoodTable,
  },
  data() {
    return {
      isLoading: true,
      fooditems: null,
      foodGroupitems: null,
      foodSubGroupitems: null,
      filteritems: null,

      lowerPages: [] as Array<Number>,
      hardOffset: 0,
      upperPages: [] as Array<Number>,

      foodName: this.$route.query.search !== undefined ? this.$route.query.search as string : "",
      allergies: this.$route.query.allergies !== undefined ? this.makeArray() : [],
      foodGroup: this.$route.query.foodgroup !== undefined ? this.$route.query.foodgroup as string : "All Foodgroups",
      subFoodGroup: this.$route.query.subfoodgroup !== undefined ? this.$route.query.subfoodgroup as string : "All Foodsubgroups",
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
      this.hardOffset = this.offset;
      this.loaded();
    },
    async fetchSubFoodGroups() {
      if (this.foodGroup != 'All Foodgroups' && this.foodGroup != '') {
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
      this.subFoodGroup = 'All Foodsubgroups';
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
      if (this.foodGroup != 'All Foodgroups')
        options.query.foodgroup = this.foodGroup;
      if (this.subFoodGroup != 'All Foodsubgroups')
        options.query.subfoodgroup = this.subFoodGroup;
      if (this.offset)
        options.query.offset = this.offset;

      this.$router.push(options);
    },
    async fetchAllergies() {
      this.filteritems = await dbService.query("SELECT DISTINCT allergy FROM allergies WHERE allergy IS NOT NULL;");
      this.filteritems = this.filteritems.rows;
    },
    setPage(i: number) {
      this.offset = i;
      this.route();
    },
    receiveRowCount(event: any, totalCount: number) {
      const pageCount = Math.ceil(totalCount / PAGE_SIZE);
      if (this.offset >= pageCount) {
        this.setPage(pageCount-1);
      }
      this.upperPages = this.countUp(this.offset, pageCount);
      this.lowerPages = this.countDown(this.offset);
      this.hardOffset = this.offset;
    },
    countUp(startValue: number, max: number): Array<number> {
      var array = [];
      for (var i = 1; i <= MAX_PAGINATION; i++) {
        var value = startValue + i;
        if (value < max) {
          array.push(value);
        } else {
          break;
        }
      }
      return array;
    },
    countDown(startValue: number) {
      var array = [];
      for (var i = 1; i <= MAX_PAGINATION; i++) {
        var value = startValue - i;
        if (value >= 0) {
          array.push(value);
        } else {
          break;
        }
      }
      array.reverse();
      return array;
    },
  }
}
</script>

<template>
  <main>
      <SpinnerComponent v-if="isLoading"></SpinnerComponent>

    <div class="container d-flex flex-column align-items-stretch" v-else>
      <div role="search" class="d-flex flex-column align-self-center" style="width: 80%">
        <div class="d-flex justify-content-center">
          <input v-model="foodName" class="form-control me-2" type="search" name="foodName"
            placeholder="Search" aria-label="Search" @keyup.enter="route" @blur="route">
          <div @click="route" class="btn btn-success">Search</div>
        </div>
        <div class="d-flex justify-content-between" style="margin-top: 5px">
          <!-- <input class="form-control me-2 focus-ring-danger" type="search" placeholder="Search" aria-label="Search"
            name="search" v-model="search"> -->
          <div>
            <!-- Food group dropdown menu -->
            <div class="select-button btn-group">
              <button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {{ foodGroup }}
              </button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" @click="setFoodgroup('All Foodgroups')">All Foodgroups</li>
                <li class="dropdown-item" v-for="foodGroupitem in foodGroupitems" @click="setFoodgroup(foodGroupitem.food_group)">
                  {{ foodGroupitem.food_group }}
                </li>
              </ul>
            </div>
            <span v-if="foodGroup != 'All Foodgroups'">></span>
            <!-- Subfoodgroup dropdown menu -->
            <div v-if="foodGroup != 'All Foodgroups'" class="select-button btn-group">
              <button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {{ subFoodGroup }}
              </button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" @click="setSubFoodGroup('All Foodsubgroups')">All Foodsubgroups</li>
                <li class="dropdown-item" v-for="foodSubGroupitem in foodSubGroupitems" @click="setSubFoodGroup(foodSubGroupitem.food_subgroup)">
                  {{ foodSubGroupitem.food_subgroup }}
                </li>
              </ul>
            </div>
          </div>
          <!-- Allergy Filter button -->
          <div class="select-button btn-group">
            <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
              Exclude Allergies
            </button>
            <ul class="dropdown-menu">
              <li class="dropdown-item" v-for="filteritem in filteritems">
                <div class="form-check">
                  <input class="form-check-input dropdown-item-checkbox" type="checkbox" :value="filteritem.allergy" :id="filteritem.allergy" name="alergies"
                    v-model="allergies" @change="route" :checked="allergies.indexOf(filteritem.allergy) != -1" />
                  <label class="form-check-label" :for="filteritem.allergy">
                    {{ filteritem.allergy }}
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="">
        <FoodTable
          :data="{ name: foodName, group: foodGroup, subgroup: subFoodGroup, offset: offset, allergies: allergies }"
          @returnTotalCount="receiveRowCount">
        </FoodTable>
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-center">
            <li v-for="n in lowerPages" class="page-item" @click="setPage(n as number)">
              <a class="page-link" href="#">{{ n as number + 1 }}</a>
            </li>
            <li class="list-group-item active">
              <a class="page-link" href="#">{{ hardOffset + 1 }}</a>
            </li>
            <li v-for="n in upperPages" class="page-item" @click="setPage(n as number)">
              <a class="page-link" href="#">{{ n as number + 1}}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import "@/../scss/custom.scss";
.container {
  padding: 40px;
}

.dropdown-item:hover {
  background-color: $app-light;
}

.dropdown-menu {
  max-height: 280px;
  overflow-y: auto;
  color: $app-red;
}

.dropdown-item-checkbox {
  margin-right: 10px;
}
</style>
