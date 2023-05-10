import type { RecipesRow } from "./dbClasses";

function bools(techniques: string): Array<boolean> {
  return techniques.slice(1, -1).replace(/\s/g, '').split(',').map(x => x === '1');
}

//https://github.com/majumderb/recipe-personalization/blob/master/recipe_gen/language.py 
export const techniqueStrings = new Array<string>('bake', 'barbecue', 'blanch', 'blend', 'boil', 'braise', 'brine', 'broil', 'caramelize', 'combine', 'crock pot', 'crush', 'deglaze', 'devein', 'dice', 'distill', 'drain', 'emulsify', 'ferment', 'freeze', 'fry', 'grate', 'griddle', 'grill', 'knead', 'leaven', 'marinate', 'mash', 'melt', 'microwave', 'parboil', 'pickle', 'poach', 'pour', 'pressure cook', 'puree', 'refrigerate', 'roast', 'saute', 'scald', 'scramble', 'shred', 'simmer', 'skillet', 'slow cook', 'smoke', 'smooth', 'soak', 'sous-vide', 'steam', 'stew', 'strain', 'tenderize', 'thicken', 'toast', 'toss', 'whip', 'whisk');

export function getFilteredTechniques(techniques: boolean[]) {
  let tempTechniqueStrings: Array<string> = new Array<string>();
  for (let i = 0; i < techniques.length; i++) {
    if (techniques[i]) {
      tempTechniqueStrings.push(techniqueStrings[i]);
    }
  }
  return tempTechniqueStrings;
}

export function getTechniqueCounts(rows: {[key: number]: RecipesRow}) {
  let techniqueCounts: Array<number> = new Array<number>(techniqueStrings.length).fill(0);
  for (let i = 0; i < Object.keys(rows).length; i++) {
    for (let j = 0; j < rows[i].techniques.length; j++) {
      if (rows[i].techniques[j]) {
        techniqueCounts[j]++;
      }
    }
  }
  return techniqueCounts;
}
