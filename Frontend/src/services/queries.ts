//('Potato Allergy','Oral')
//('Potato', 'Sweet Potato')
export function GET_FOOD_FOR_NAME(name: string = "", allergies: string[] = [], foodGroup: string = "", subFoodGroup: string = "", pageCount: number = 0): string {
	if (foodGroup == "All") foodGroup = "";
	if (subFoodGroup == "All") subFoodGroup = "";

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

export function GET_FOODCOUNT_FOR_NAME(name: string = ""): string {
	return `SELECT COUNT(*) as c
	FROM food
	WHERE (
		lower(food.naam) LIKE '%`+name.toLocaleLowerCase()+`%'
	)`;
}

export function MACRO_NUTRIENTS_FOR(id: string): string {
	return `SELECT 'Fiber' as name,orig_source_name,orig_content as value FROM food,nutrients
WHERE ( 
	food.id = `+ id + ` AND
	lower(orig_source_name) LIKE '%fiber%' AND
	food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Fat' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+ id + ` AND
		lower(orig_source_name) LIKE '%fat%' AND
		lower(orig_source_name) NOT LIKE '%fatty acid%' AND
		food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Fatty Acid' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+ id + ` AND
		lower(orig_source_name) LIKE '%fatty acid%' AND
		food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Proteins' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+ id + ` AND
		lower(orig_source_name) LIKE '%protein%' AND
		food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Carbohydrate' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+ id + ` AND
		lower(orig_source_name) LIKE '%carb%' AND
		food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Ash' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+ id + ` AND
		lower(orig_source_name) LIKE '%ash%' AND
		food.id = nutrients.food_id
	)
ORDER BY name`;
};

export function GET_RECIPES_FOR(id: string): string {
	return `SELECT DISTINCT
		pp_recipes.id as recipeid,
		raw_recipes.name as recipename,
		food.id as foodid, 
		food.naam as foodname,
		pp_recipes.techniques as techniques
	FROM food,ingredients_filtered,pp_recipes,raw_recipes
	WHERE (
		food.id = `+ id +` AND
		(lower(ingredients_filtered.processed) LIKE CONCAT('%', CONCAT(lower(food.naam), '%'))) AND 
		pp_recipes.ingredient_ids ~ CONCAT('(?<=\\D)',CONCAT(ingredients_filtered.id, '(?=\\D)')) AND
		pp_recipes.id = raw_recipes.id 
	)
	ORDER BY recipename
	LIMIT 100`;
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