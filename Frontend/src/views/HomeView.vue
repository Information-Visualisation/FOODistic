<script lang="ts">
import FoodItem from '../components/FoodItem.vue'
import { DBService } from '../services/db.service'
import FoodPicker from '../components/FoodPicker.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import FoodTable from '@/components/table/FoodTable.vue';
import VueNumberInput from '@chenfengyuan/vue-number-input';
import type { FoodRow } from '@/services/dbClasses';
const MAX_PAGINATION: number = 10;

const dbService = new DBService;
export default {
  components: {
    FoodItem,
    FoodPicker,
    SpinnerComponent,
    FoodTable,
    VueNumberInput,
  },
  data() {
    return {
      isLoading: true,
      fooditems: [] as FoodRow[],
      foodGroupitems: [] as { food_group: string }[],
      foodSubGroupitems: [] as { food_subgroup: string }[],
      filteritems: {} as { [key: number]: { allergy: string } },

      lowerPages: [] as Array<Number>,
      hardOffset: 0,
      upperPages: [] as Array<Number>,

      foodName: this.$route.query.search !== undefined ? this.$route.query.search as string : "",
      allergies: this.$route.query.allergies !== undefined ? this.makeArray() : [],
      includes: this.$route.query.includes !== undefined ? this.makeArray(false) : [],
      foodGroup: this.$route.query.foodgroup !== undefined ? this.$route.query.foodgroup as string : "All Foodgroups",
      subFoodGroup: this.$route.query.subfoodgroup !== undefined ? this.$route.query.subfoodgroup as string : "All Foodsubgroups",
      offset: this.$route.query.offset !== undefined ? parseInt(this.$route.query.offset as string) : 0,
      pageSize: this.$route.query.pageSize !== undefined ? parseInt(this.$route.query.pageSize as string) : 24,
    }
  },
  created: function () {
    // let result1 = this.changeParamString(this.$route.params.allergy)
    // this.changeAllergy(result1)
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.foodGroupitems = (await dbService.query(`SELECT DISTINCT food_group FROM food WHERE food_group is NOT NULL`)).rows;
      this.fetchAllergies();
      this.fetchSubFoodGroups();
      this.hardOffset = this.offset;
      this.loaded();
    },
    async fetchSubFoodGroups() {
      if (this.foodGroup != 'All Foodgroups' && this.foodGroup != '') {
        this.foodSubGroupitems = (await dbService.query(`SELECT DISTINCT food_subgroup FROM food WHERE food_group = '` + this.foodGroup + `' AND food_subgroup is NOT NULL`)).rows;
      }
    },
    makeArray(isAllergies: boolean = true) {
      if (isAllergies) {
        if (typeof this.$route.query.allergies === 'string') {
          return new Array(this.$route.query.allergies as string);
        }
        return this.$route.query.allergies as Array<string>;
      } else {
        if (typeof this.$route.query.includes === 'string') {
          return new Array(this.$route.query.allergies as string);
        }
        return this.$route.query.includes as Array<string>;
      }
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
      let options = { name: 'home', query: {} as { search: string, allergies: string, includes: string, foodgroup: string, subfoodgroup: string, offset: number, pageSize: number } };
      if (this.foodName != '')
        options.query.search = this.foodName;
      if (this.allergies.length != 0)
        options.query.allergies = this.allergies;
      if (this.includes.length != 0)
        options.query.includes = this.includes;
      if (this.foodGroup != 'All Foodgroups')
        options.query.foodgroup = this.foodGroup;
      if (this.subFoodGroup != 'All Foodsubgroups')
        options.query.subfoodgroup = this.subFoodGroup;
      if (this.offset >= 0)
        options.query.offset = this.offset;
      if (this.pageSize >= 1 && this.pageSize <= 1000)
        options.query.pageSize = this.pageSize;

      this.$router.push(options);
    },
    async fetchAllergies() {
      this.filteritems = (await dbService.query("SELECT DISTINCT allergy FROM allergies WHERE allergy IS NOT NULL;")).rows;
    },
    setPage(i: number) {
      this.route();
      this.offset = i;
    },
    receiveRowCount(event: any, totalCount: number) {
      const pageCount = Math.ceil(totalCount / this.pageSize);
      if (this.offset >= pageCount) {
        this.setPage(pageCount - 1);
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
    setItemsPerPage() {
      this.pageSize = this.$refs.numberinput!.value;
      this.route();
    }
  }
}
</script>

<template>
  <main>
    <SpinnerComponent v-if="isLoading"></SpinnerComponent>

    <div class="container d-flex flex-column align-items-stretch" v-else>
      <div role="search" class="d-flex flex-column align-self-center" style="width: 80%">
        <div class="d-flex justify-content-center">
          <input v-model="foodName" class="form-control me-2" type="search" name="foodName" placeholder="Search"
            aria-label="Search" @keyup.enter="route" @blur="route">
          <div @click="route" class="btn btn-success">Search</div>
        </div>
        <div class="d-flex justify-content-between" style="margin-top: 5px">
          <!-- <input class="form-control me-2 focus-ring-danger" type="search" placeholder="Search" aria-label="Search"
            name="search" v-model="search"> -->
          <div>
            <!-- Food group dropdown menu -->
            <div class="select-button btn-group">
              <button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown"
                aria-expanded="false">
                {{ foodGroup }}
              </button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" @click="setFoodgroup('All Foodgroups')">All Foodgroups</li>
                <li class="dropdown-item" v-for="foodGroupitem in foodGroupitems"
                  @click="setFoodgroup(foodGroupitem.food_group)">
                  {{ foodGroupitem.food_group }}
                </li>
              </ul>
            </div>
            <span v-if="foodGroup != 'All Foodgroups'">></span>
            <!-- Subfoodgroup dropdown menu -->
            <div v-if="foodGroup != 'All Foodgroups'" class="select-button btn-group">
              <button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown"
                aria-expanded="false">
                {{ subFoodGroup }}
              </button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" @click="setSubFoodGroup('All Foodsubgroups')">All Foodsubgroups</li>
                <li class="dropdown-item" v-for="foodSubGroupitem in foodSubGroupitems"
                  @click="setSubFoodGroup(foodSubGroupitem.food_subgroup)">
                  {{ foodSubGroupitem.food_subgroup }}
                </li>
              </ul>
            </div>
          </div>
          <div>
            <!-- Allergy Filter button -->
            <div class="select-button btn-group">
              <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown"
                data-bs-auto-close="false" aria-expanded="false">
                Exclude Allergies
              </button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" v-for="exclude in filteritems">
                  <div class="form-check">
                    <input class="form-check-input dropdown-item-checkbox" type="checkbox" :value="exclude.allergy"
                      :id="exclude.allergy+'exclude'" name="alergies" v-model="allergies" @change="route"
                      :checked="allergies.indexOf(exclude.allergy) != -1" />
                    <label class="form-check-label" :for="exclude.allergy+'exclude'">
                      {{ exclude.allergy }}
                    </label>
                  </div>
                </li>
              </ul>
            </div>
            <!-- Allergy Selector button -->
            <div class="select-button btn-group includes">
              <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                data-bs-auto-close="false" aria-expanded="false">
                Include Allergies
              </button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" v-for="include in filteritems">
                  <div class="form-check">
                    <input class="form-check-input dropdown-item-checkbox" type="checkbox" :value="include.allergy"
                      :id="include.allergy+'include'" name="alergies" v-model="includes" @change="route"
                      :checked="includes.indexOf(include.allergy) != -1" />
                    <label class="form-check-label" :for="include.allergy+'include'">
                      {{ include.allergy }}
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="collapse" id="collapseExample">
          This is the search and filter widget for the Homeview. Here you can search for foods via search terms, filter in
          (sub)foodgroups and exclude allergies.
          All the filters applied here will also be applied on every tab in the bottom table. (Food, Nutrition, Allergies,
          Recipes).
        </div>
      </div>
      <div class="">
        <FoodTable
          :foodPickerData="{ name: foodName, group: foodGroup, subgroup: subFoodGroup, offset: offset, allergies: allergies, includes: includes, pageSize: pageSize }"
          @returnTotalCount="receiveRowCount">
        </FoodTable>
        <!-- Pagination -->
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-center">
            <li>
              <VueNumberInput ref="numberinput" placeholder="per page" class="ItemPerPage" :min="1" :max="1000" :step="15"
                :model-value="pageSize" inline center @keyup.enter="setItemsPerPage()" />
            </li>
            <li>
              <a type="button" class="btn btn-success ItemPerPageButton" @click="setItemsPerPage()" href="#">✓</a>
            </li>
            <li :class="'page-item ' + (lowerPages.length <= 0 ? 'disabled' : '')"
              @click="setPage(lowerPages[lowerPages.length - 1] as number)">
              <a class="page-link" href="#">&laquo;</a>
            </li>
            <li v-for="n in lowerPages" class="page-item" @click="setPage(n as number)">
              <a class="page-link" href="#">{{ n as number + 1 }}</a>
            </li>
            <li class="list-group-item active">
              <a class="page-link" href="#">{{ hardOffset + 1 }}</a>
            </li>
            <li v-for="n in upperPages" class="page-item" @click="setPage(n as number)">
              <a class="page-link" href="#">{{ n as number + 1 }}</a>
            </li>
            <li :class="'page-item ' + (upperPages.length <= 0 ? 'disabled' : '')"
              @click="setPage(upperPages.length > 0 ? upperPages[0] as number : hardOffset)">
              <a class="page-link" href="#">&raquo;</a>
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

.ItemPerPage {
  width: 100px;
}

.ItemPerPageButton {
  margin-right: 20px;
}

.includes {
  margin-left: 10px;
}
</style>
