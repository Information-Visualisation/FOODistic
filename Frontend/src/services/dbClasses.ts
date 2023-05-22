export type { Rows, Row, NutrientRow, DistinctRows, FoodRow, FoodAllergyRow, AllergyPercentageRow, RecipesRow, DatasetGraphRow, DatasetStarRow, DatasetRecipeRow, CombinedRecipes }

type Rows = {
    [x: string]: any;
    rows: [Row]
};

type Row = {
    name: string,
    value: string,
};

type NutrientRow = {
    id: string,
    naam: string,
    nutrient: string,
    orig_source_name: string,
    value: string,
}

type DistinctRows = {
    [key: string]: number[]
};

type FoodRow = {
    category: string,
    created_at: string,
    creator_id: number,
    description: string,
    export_to_afcdb: boolean,
    export_to_foodb: boolean,
    food_group: string,
    food_subgroup: string,
    food_type: string,
    id: number,
    itis_id: string,
    legacy_id: number,
    naam: string,
    naam_scientific: string,
    ncbi_taxonomy_id: number,
    picture_conten_type: string,
    picture_file_name: string,
    picture_file_size: number,
    picture_updated_at: string,
    public_id: string,
    updated_at: string,
    updater_id: number,
    wikipedia_id: string,
};

type FoodAllergyRow = {
    allergy: string,
    food: string,
};

type AllergyPercentageRow = {
    allergy: string,
    percentage: number,
};

type RecipesRow = {
    foodid: number,
    foodname: string,
    recipeid: number,
    recipename: string,
    techniques: Array<boolean>,
    nutritions: Array<number>
};

type DatasetGraphRow = {
    label: string,
    data: Array<{}>,
    backgroundColor: Array<String>,
    borderColor: Array<String>,
    borderWidth: number,
};

type DatasetStarRow = {
    label: string,
    data: Array<Number>,
    backgroundColor: string,
    borderColor: string,
    pointBackgroundColor: string,
    pointBorderColor: string,
    pointHoverBackgroundColor: string,
    pointHoverBorderColor: string,
}

type DatasetRecipeRow = {
    label: Array<String>,
    data: Array<{}>,
    fill: boolean,
    borderColor: string,
    backgroundColor: string,
};

type CombinedRecipes = {
    ofFoods: Array<Array<String>>,
    combinedRecipes: Array<RecipesRow>
};