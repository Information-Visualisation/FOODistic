export function GET_FOOD_FOR_NAME(name: string = "", allergies: string[] = [], foodGroup: string = "", subFoodGroup: string = "", pageCount: number = 0): string {
	if (foodGroup == "All Foodgroups") foodGroup = "";
	if (subFoodGroup == "All Foodsubgroups") subFoodGroup = "";

	const pageSize: number = 24;
	return `SELECT * 
	FROM food
	WHERE (
		lower(food.naam) LIKE '%`+name.toLocaleLowerCase()+`%'
		`+(foodGroup==""?"":(`AND food.food_group = '`+foodGroup+`'`))+`
		`+(subFoodGroup==""?"":(`AND food.food_subgroup = '`+subFoodGroup)+`'`)+`
		`+orAllergies(allergies)+`
	) 
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

function orAllergies(allergies: string[]) {
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
	return `SELECT *
	FROM recipes,food_ingredient_linker as fi
	WHERE (
		fi.food_id = `+id+` AND
		fi.ingredient_id = ANY (recipes.ingredient_ids)
	)`;
}

export function GET_INGREDIENTS_FOR(id: string): string {
	return `SELECT raw_recipes.name,pp_recipes.ingredient_ids,ingredients_filtered.processed
	FROM raw_recipes, pp_recipes, ingredients_filtered
	WHERE (
		pp_recipes.id = `+id+` AND
		raw_recipes.id = pp_recipes.id AND
		pp_recipes.ingredient_ids ~ CONCAT('(?<=\D)',CONCAT(ingredients_filtered.id, '(?=\D)'))
	)`;
}

export function GET_ALLERGY_FOR(foodName: string): string {
	return "SELECT allergy FROM allergies WHERE food="+ foodName;
}

export function GET_ALLERGIES_FOR(foods: Object[]): string {
	let query = "SELECT DISTINCT allergy FROM allergies WHERE allergy IS NOT null AND (";
	for (let i = 0; i < foods.length - 1; ++i) {
		query += "food = '" + foods[i]?.naam + "' OR ";
	}
	query += "food = '" + foods.pop()?.naam + "') ORDERY BY allergy;";
	return query;
}

export function GET_ALLERGIES_PER_FOOD_FOR(foods: Object[]): string {
	let query = "SELECT food, allergy FROM allergies WHERE allergy IS NOT null AND (";
	for (let i = 0; i < foods.length - 1; ++i) {
		query += "food = '" + foods[i]?.naam + "' OR ";
	}
	query += "food = '" + foods.pop()?.naam + "') ORDER BY allergy;";
	return query;
}

export function COUNT_ALLERGIES_FOR(foods: Object[]): string {
	let query = "SELECT allergy, COUNT(allergy) / SUM(COUNT(allergy)) OVER() * 100 as percentage FROM allergies WHERE allergy IS NOT NULL AND (";
	for (let i = 0; i < foods.length - 1; ++i) {
		query += "food = '" + foods[i]?.naam + "' OR ";
	}
	query += "food = '" + foods.pop()?.naam + "') GROUP BY allergy ORDER BY allergy;";
	return query;
}