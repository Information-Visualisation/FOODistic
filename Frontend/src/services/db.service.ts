import type { DistinctRows, NutrientRow } from './dbClasses';

const nutrientsFoodDB: Array<String> = ['Ash', 'Carbohydrate', 'Fat', 'Fatty Acid', 'Fiber', 'Proteins'];
const nutrientsRecipeDB: Array<String> = ['Sodium', 'Carbohydrate', 'Fat', 'Sugar', 'Saturated fat', 'Proteins'];

export class DBService {
  async query(query: string, log: boolean = false): Promise<any> {
    try {
      return fetch('http://127.0.0.1:3080/db?query=' + encodeURI(query), {}).then(function (response) {
        return response.text();
      }).then(function (data) {
        if (log) { console.log(data); } // this will be a string
        return JSON.parse(data);
      });
    } catch (e) {
      console.log("There was an error with your query: " + e);
    }
  }
}

export function distinctNames(rows: Array<NutrientRow>): DistinctRows {
  const names: DistinctRows = {};
  rows.forEach((row) => {
    if (names[row.nutrient]) {
      names[row.nutrient].push(parseFloat(row.value));
    } else {
      names[row.nutrient] = [parseFloat(row.value)];
    }
  });
  return names;
}

export { nutrientsRecipeDB, nutrientsFoodDB }