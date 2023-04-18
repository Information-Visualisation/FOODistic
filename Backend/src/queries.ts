export function CREATE_INGREDIENTS_VIEW() {
	return `CREATE OR REPLACE VIEW public.ingredients_filtered
	AS
	SELECT DISTINCT ingredients.id, ingredients.replaced, ingredients.processed
	  FROM ingredients
	 ORDER BY ingredients.id;`;
}