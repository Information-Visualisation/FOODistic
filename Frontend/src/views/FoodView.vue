<script lang="ts">
import SpinnerComponent from '../components/SpinnerComponent.vue';
import Food from './Food.vue';
import FoodPicker from '../components/FoodPicker.vue';
import RadarPlot from '../components/RadarPlot.vue';

export default {
    components: {
        SpinnerComponent,
        Food,
        FoodPicker,
        RadarPlot
    },
    data() {
        return {
            comparing: false,
            picked: false,
            compareSearch: this.$route.query.search as string,
            id: '',
        }
    },
    created() {
        if (this.$route.query.compareSearch !== undefined) {
            this.comparing = true;
        }
        if (this.$route.query.otherid !== undefined) {
            this.comparing = true;
            this.picked = true;
            this.id = this.$route.query.otherid as string;
        }
    },
    methods: {
        compare(event: any, id: string) {
            this.id = id;
            this.picked = true;
            this.backToPicked();
        },
        toggleComparing() {
            this.comparing = !this.comparing;

            if (this.comparing) {
                if (this.id !== '' && this.picked) {
                    this.backToPicked();
                } else {
                    this.startComparing();
                }
            } else {
                this.stopComparing();
            }
        },
        deletePicked() {
            this.startComparing();
            this.picked = false;
            this.id = '';
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
        startComparing() {
            this.$router.push({
                name: 'food',
                params: {
                    name: this.$route.params.name,
                },
                query: {
                    id: this.$route.query.id,
                    compareSearch: this.compareSearch === undefined ? '' : this.compareSearch
                }
            });
        },
        stopComparing() {
            this.$router.push({
                name: 'food',
                params: {
                    name: this.$route.params.name,
                },
                query: {
                    id: this.$route.query.id,
                }
            });
        },
        backToPicked() {
            this.$router.push({
                name: 'food',
                params: {
                    name: this.$route.params.name,
                },
                query: {
                    id: this.$route.query.id,
                    otherid: this.id,
                }
            });
        }
    }
}
</script>

<template>
    <div class="position-relative">
        <div class="hstack gap-3">
            <div class="row">
                <div class="col">
                    <Food></Food>
                </div>
                <Transition>
                    <div class="vr" v-if="comparing"></div>
                </Transition>
                <Transition>
                    <div class="col" v-if="comparing">
                        <div v-if="!picked">
                            <form class="d-flex justify-content-start search" role="search">
                                <input v-model="compareSearch" class="form-control me-2" type="search" name="compareSearch"
                                    placeholder="Search For Another Food To Compare" aria-label="Search">
                                <RouterLink :to="{
                                        name: 'food',
                                        params: {
                                            name: $route.params.name,
                                        },
                                        query: {
                                            id: $route.query.id,
                                            compareSearch: compareSearch,
                                        }
                                    }" class="btn btn-outline-success" type="submit">Search</RouterLink>
                            </form>
                            <FoodPicker class="foodpickerDown" :name="compareSearch" :comparing="true" @compare="compare">
                            </FoodPicker>
                        </div>
                        <div v-if="picked">
                            <Food :idp="id"></Food>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
        <div class="hl"></div>
        <div v-if="picked" class="row card wide">
            <RadarPlot :id="($route.query.id as string)" :otherId="id"></RadarPlot>
        </div>
        <div class="position-absolute top-0 end-0 m-3"> <!-- TODO: explain the 3 buttons -->
            <button v-if="!comparing" class="btn btn-success mb-3" @click="toggleComparing">Compare ▶</button>
            <button v-if="comparing" type="button" class="btn btn-success mb-3" aria-label="Collapse"
                @click="toggleComparing">
                ◀ Collapse
            </button>
            <button v-if="picked" type="button" class="btn btn-danger mb-3" aria-label="Close" @click="deletePicked">
                <b>✕</b>
            </button>
            <a :href="$router.resolve({
                    name: 'food',
                    params: {
                        name: $route.params.name,
                    },
                    query: {
                        id: id,
                        compareSearch: this.compareSearch
                    },
                }).href" v-if="picked" type="button" class="btn btn-success mb-3" aria-label="Close">
                Main ▶
            </a>
            <br>
            <button class="btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
                aria-expanded="false" aria-controls="collapseExample">
                Help <b>?</b>
            </button>
        </div>
    </div>
</template>
    
<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.vl {
    border-left: 3px dotted lightgray;
    height: 100%;
    position: absolute;
    left: 50%;
    margin-left: -3px;
    top: 0;
}

.hl {
    border-top: 3px dotted lightgray;
}

.search {
    width: 75%;
    padding-left: 45px;
    padding-top: 45px;
}

.foodpickerDown {
    padding-top: 30px;
}

.wide {
    width: 680px
}
</style>