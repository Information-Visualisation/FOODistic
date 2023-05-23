import type { FoodRow } from './dbClasses';
export function GET_FOOD_FOR_NAME(name: string = "", allergies: string[] = [], foodGroup: string = "", subFoodGroup: string = "", pageCount: number = 0, pageSize: number = 15): string {
	if (foodGroup == "All Foodgroups") foodGroup = "";
	if (subFoodGroup == "All Foodsubgroups") subFoodGroup = "";
	return `SELECT * 
	FROM food
	WHERE (
		lower(food.naam) LIKE '%`+name.toLocaleLowerCase()+`%'
		`+(foodGroup==""?"":(`AND food.food_group = '`+foodGroup+`'`))+`
		`+(subFoodGroup==""?"":(`AND food.food_subgroup = '`+subFoodGroup)+`'`)+`
		`+orAllergies(allergies)+`
	)
	ORDER BY food.naam
	LIMIT `+pageSize+`
	OFFSET `+pageSize*pageCount;
}

export function GET_FOODCOUNT_FOR_NAME(name: string = "", allergies: string[] = [], foodGroup: string = "", subFoodGroup: string = ""): string {
	if (foodGroup == "All Foodgroups") foodGroup = "";
	if (subFoodGroup == "All Foodsubgroups") subFoodGroup = "";
	return `SELECT COUNT(*) as c
	FROM food
	WHERE (
		lower(food.naam) LIKE '%`+name.toLocaleLowerCase()+`%'
		`+(foodGroup==""?"":(`AND food.food_group = '`+foodGroup+`'`))+`
		`+(subFoodGroup==""?"":(`AND food.food_subgroup = '`+subFoodGroup)+`'`)+`
		`+orAllergies(allergies)+`
	)`;
}

function orAllergies(allergies: string[]): string {
	if (allergies.length!=0) {
		let queryString: string = `AND NOT (lower(food.naam) LIKE '%`+allergies[0].toLocaleLowerCase()+`%'`;
		for (let i = 1; i < allergies.length; i++) {
			queryString += `OR lower(food.naam) LIKE '%`+allergies[i].toLocaleLowerCase()+`%'`;
		}
		queryString += ')';
		return queryString;
	} else {
		return '';
	}
}

export function GET_FOOD_FOR_ID(id: string = ""): string {
	return `SELECT * 
	FROM food
	WHERE (
		id=`+id+`
	)`;
}


export function MACRO_NUTRIENTS_FOR(id: string): string {
	return `SELECT *
	FROM nutrients_filtered as nf
	WHERE (
		nf.id = `+id+`
	)
	ORDER BY nutrient`;
};

export function MACRO_NUTRIENTS_FOR_FOODS(ids: Array<string>): string {
	// TAKES VERY LONG
	// TODO: Make a smaller nutrients table
	if (ids.length > 2) {
		let idList: string = ids[0]
		for (let i = 1; i < ids.length; i++) {
			idList += ` OR food.id = `+ ids[i];
		}
		return MACRO_NUTRIENTS_FOR(idList);
	} else
		throw new Error();
}

export function GET_RECIPES_FOR(id: string): string {
	return `SELECT DISTINCT
	fi.food_id as foodid,
	fi.food_naam as foodname,
	recipes_filtered.id as recipeid,
	raw_recipes.name as recipename,
	recipes_filtered.techniques,
	raw_recipes.nutrition as nutritions
	FROM recipes_filtered,raw_recipes,food_ingredient_linker as fi
	WHERE (
		recipes_filtered.id = raw_recipes.id AND
		fi.food_id = `+id+` AND
		fi.ingredient_id = ANY (recipes_filtered.ingredient_ids)
	)
	LIMIT 100`;
}

export function GET_RECIPE(id: string): string{
	return `SELECT DISTINCT
    fil.food_id as foodid,
    fil.food_naam as foodname,
	rf.name as recipename,
    rf.techniques
FROM recipes_filtered as rf, food_ingredient_linker as fil
WHERE (
    rf.id = `+ id +` AND
    fil.ingredient_id = ANY (rf.ingredient_ids)
)`;
}

export function GET_RECIPE_NUTRIENTS(id: string): string{
	return `SELECT DISTINCT
		pp_recipes.id as recipeid,
		raw_recipes.nutrition as nutritions
	FROM food,pp_recipes,raw_recipes
	WHERE (
		pp_recipes.id = `+ id +` AND raw_recipes.id = `+ id +`
	);`
}

export function COUNT_RECIPE_FOR(ids: number[]){
	return `SELECT DISTINCT
	fi.food_id as foodid,
	COUNT(raw_recipes.name) as recipecount
	FROM recipes_filtered,raw_recipes,food_ingredient_linker as fi
	WHERE (
		recipes_filtered.id = raw_recipes.id AND
		(` + orFoodIds(ids) + `fi.food_id = ` + ids[ids.length-1] + `) AND
		fi.ingredient_id = ANY (recipes_filtered.ingredient_ids)
	)
	GROUP BY fi.food_id`
}

function orFoodIds(ids: number[]) {
	let query: string = ""
	for (let i = 0; i < ids.length - 1; ++i) {
		query += "fi.food_id = " + ids[i] + " OR ";
	}
	return query;
}

export function GET_ALLERGY_FOR(foodName: string): string {
	return "SELECT allergy FROM allergies WHERE food='"+ foodName +"' AND allergy IS NOT NULL";
}

export function GET_ALLERGIES_FOR(foods: FoodRow[]): string {
	let query = "SELECT DISTINCT allergy FROM allergies WHERE allergy IS NOT null AND (";
	query += orFoods(foods);
	query += "food = '" + foods[foods.length-1]?.naam + "') ORDER BY allergy;";
	return query;
}

export function GET_ALLERGIES_PER_FOOD_FOR(foods: FoodRow[]): string {
	let query = "SELECT food, allergy FROM allergies WHERE allergy IS NOT null AND (";
	query += orFoods(foods);
	query += "food = '" + foods[foods.length-1]?.naam + "') ORDER BY allergy;";
	return query;
}

export function COUNT_ALLERGIES_FOR(foods: FoodRow[]): string {
	let query = "SELECT allergy, COUNT(allergy) / SUM(COUNT(allergy)) OVER() * 100 as percentage, COUNT(allergy) as count FROM allergies WHERE allergy IS NOT NULL AND (";
	query += orFoods(foods);
	query += "food = '" + foods[foods.length-1]?.naam + "') GROUP BY allergy ORDER BY allergy;";
	return query;
}

function orFoods(foods: FoodRow[]) {
	let query: string = ""
	for (let i = 0; i < foods.length - 1; ++i) {
		query += "food = '" + foods[i]?.naam + "' OR ";
	}
	return query;
}

export function GET_ALLERGIES_RECIPE(foods: string){
	return "SELECT DISTINCT allergies.allergy FROM allergies WHERE allergies.food in "+ foods + " AND allergy IS NOT NULL";
}