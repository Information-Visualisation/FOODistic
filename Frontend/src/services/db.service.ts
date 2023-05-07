type Rows = {
  [x: string]: any;
  rows: [Row]
};
type Row = {
  name: string,
  value: string,
}
type DistinctRows = {
  [key: string]: number[]
}

export class DBService {
  async query(query: string, log: boolean = false): Promise<any> {
    return fetch('http://127.0.0.1:3080/db?query=' + encodeURI(query), {}).then(function (response) {
      return response.text();
    }).then(function (data) {
      if (log) { console.log(data); } // this will be a string
      return JSON.parse(data);
    }).catch(function (error) {
      console.log(error);
    });
  }
}

export function distinctNames(rows: Rows): DistinctRows {
  const names: DistinctRows = {};
  rows.forEach((row: Row) => {
    if (names[row.nutrient]) {
      names[row.nutrient].push(parseFloat(row.value));
    } else {
      names[row.nutrient] = [parseFloat(row.value)];
    }
  });
  return names;
}

export type { Rows, Row, DistinctRows }
