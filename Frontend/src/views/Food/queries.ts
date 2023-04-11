
export function MacroNutrientsQuery(id: string): string {
	return `SELECT 'Fiber' as name,orig_source_name,orig_content as value FROM food,nutrients
WHERE ( 
	food.id = `+id+` AND
	lower(orig_source_name) LIKE '%fiber%' AND
	food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Fat' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+id+` AND
		lower(orig_source_name) LIKE '%fat%' AND
		lower(orig_source_name) NOT LIKE '%fatty acid%' AND
		food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Fatty Acid' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+id+` AND
		lower(orig_source_name) LIKE '%fatty acid%' AND
		food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Proteins' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+id+` AND
		lower(orig_source_name) LIKE '%protein%' AND
		food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Carbohydrate' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+id+` AND
		lower(orig_source_name) LIKE '%carb%' AND
		food.id = nutrients.food_id
	)
UNION ALL
	SELECT 'Ash' as name,orig_source_name,orig_content as value FROM food,nutrients
	WHERE ( 
		food.id = `+id+` AND
		lower(orig_source_name) LIKE '%ash%' AND
		food.id = nutrients.food_id
	)
ORDER BY name`;
};