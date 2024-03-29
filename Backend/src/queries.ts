export function CREATE_INGREDIENTS_VIEW() {
	return `CREATE OR REPLACE VIEW public.ingredients_filtered
			AS
			SELECT DISTINCT ingredients.id, ingredients.replaced, ingredients.processed
			FROM ingredients
			ORDER BY ingredients.id;`;
}

export function CREATE_NUTRIENTS_FILTERED() {
	return `CREATE TABLE nutrients_filtered AS 
	SELECT food.id, food.naam, 'Fiber' as nutrient,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		lower(orig_source_name) LIKE '%fiber%' AND
		food.id = nutrients.food_id
		)
	UNION ALL
		SELECT food.id, food.naam, 'Fat' as nutrient,orig_source_name,orig_content as value FROM food,nutrients
		WHERE ( 
			lower(orig_source_name) LIKE '%fat%' AND
			lower(orig_source_name) NOT LIKE '%fatty acid%' AND
			food.id = nutrients.food_id
		)
	UNION ALL
		SELECT food.id, food.naam, 'Fatty Acid' as nutrient,orig_source_name,orig_content as value FROM food,nutrients
		WHERE ( 
			lower(orig_source_name) LIKE '%fatty acid%' AND
			food.id = nutrients.food_id
		)
	UNION ALL
		SELECT food.id, food.naam, 'Proteins' as nutrient,orig_source_name,orig_content as value FROM food,nutrients
		WHERE ( 
			lower(orig_source_name) LIKE '%protein%' AND
			food.id = nutrients.food_id
		)
	UNION ALL
		SELECT food.id, food.naam, 'Carbohydrate' as nutrient,orig_source_name,orig_content as value FROM food,nutrients
		WHERE ( 
			lower(orig_source_name) LIKE '%carb%' AND
			food.id = nutrients.food_id
		)
	UNION ALL
		SELECT food.id, food.naam, 'Ash' as nutrient,orig_source_name,orig_content as value FROM food,nutrients
		WHERE ( 
			lower(orig_source_name) LIKE '%ash%' AND
			food.id = nutrients.food_id
		)`;
}

export function CREATE_FOOD_INGREDIENT_LINKER() {
	return `CREATE TABLE food_ingredient_linker AS
			SELECT 
				food.id as food_id, 
				food.naam as food_naam,
				ing.id as ingredient_id,
				ing.replaced as ingredient_naam
			FROM food, ingredients_filtered as ing
			WHERE (
				-- link food name to a replaced ingredient name
				lower(ing.replaced) LIKE CONCAT('%', CONCAT(lower(food.naam), '%')) AND 
				-- make sure that double matches (apple & pineapple) don't happen
				-- if apple matches but also pineapple, then record not used
				-- meaning apple will only have the apple records and only pineapple will have the pineapple records
				NOT lower(ing.replaced) = ANY (
					SELECT ing.replaced
					FROM food as f
					WHERE (
						f.id != food.id AND
						lower(ing.replaced) LIKE CONCAT('%', CONCAT(lower(f.naam), '%')) AND
						LENGTH(f.naam) > LENGTH(food.naam)
					)
				)
			)
			ORDER BY food_naam`;
}

export function CREATE_RECIPES() {
	return `CREATE TABLE recipes_filtered AS
			SELECT 
				pp_recipes.id,
				raw_recipes.name, 
				string_to_array(
					substr(pp_recipes.techniques, 2, length(pp_recipes.techniques) - 2), ', ',' '
				)::boolean[] as techniques,
				-- convert the ingredient_ids string "{1, 3, 4, 6}" to an array of ints
				string_to_array(
					substr(ingredient_ids, 2, length(ingredient_ids) - 2), ', ',' '
				)::int[] as ingredient_ids
			FROM pp_recipes, raw_recipes 
			WHERE pp_recipes.id = raw_recipes.id`;
}