"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_INGREDIENTS_VIEW = void 0;
function CREATE_INGREDIENTS_VIEW() {
    return "CREATE OR REPLACE VIEW public.ingredients_filtered\n\tAS\n\tSELECT DISTINCT ingredients.id, ingredients.replaced, ingredients.processed\n\t  FROM ingredients\n\t ORDER BY ingredients.id;";
}
exports.CREATE_INGREDIENTS_VIEW = CREATE_INGREDIENTS_VIEW;
//# sourceMappingURL=queries.js.map