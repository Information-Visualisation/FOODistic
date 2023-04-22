function bools(techniques: string): Array<boolean> {
  return techniques.slice(1, -1).replace(/\s/g, '').split(',').map(x => x === '1');
}

//https://github.com/majumderb/recipe-personalization/blob/master/recipe_gen/language.py 
export const techniqueStrings = new Array<string>('bake', 'barbecue', 'blanch', 'blend', 'boil', 'braise', 'brine', 'broil', 'caramelize', 'combine', 'crock pot', 'crush', 'deglaze', 'devein', 'dice', 'distill', 'drain', 'emulsify', 'ferment', 'freeze', 'fry', 'grate', 'griddle', 'grill', 'knead', 'leaven', 'marinate', 'mash', 'melt', 'microwave', 'parboil', 'pickle', 'poach', 'pour', 'pressure cook', 'puree', 'refrigerate', 'roast', 'saute', 'scald', 'scramble', 'shred', 'simmer', 'skillet', 'slow cook', 'smoke', 'smooth', 'soak', 'sous-vide', 'steam', 'stew', 'strain', 'tenderize', 'thicken', 'toast', 'toss', 'whip', 'whisk');

export function getFilteredTechniques(techniques: string) {
  let boolList: Array<Boolean> = bools(techniques);
  let tempTechniqueStrings: Array<string> = new Array<string>();
  for (let i = 0; i < boolList.length; i++) {
    if (boolList[i] == true) {
      tempTechniqueStrings.push(techniqueStrings[i]);
    }
  }
  return tempTechniqueStrings;
}

export function getTechniqueCounts(rows: any) {
  let techniqueCounts: Array<number> = new Array<number>(techniqueStrings.length).fill(0);
  for (let i = 0; i < rows.length; i++) {
    let techniques = bools(rows[i].techniques);
    for (let j = 0; j < techniques.length; j++) {
      if (techniques[j]) {
        techniqueCounts[j]++;
      }
    }
  }
  console.log(techniqueCounts);
  return techniqueCounts;
}
