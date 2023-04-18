
export function CREATE_INGREDIENTS_VIEW() {
	return `CREATE OR REPLACE VIEW public.ingredients_filtered
	AS
	SELECT DISTINCT ingredients.id, ingredients.replaced, ingredients.processed
	  FROM ingredients
	 ORDER BY ingredients.id;`;
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