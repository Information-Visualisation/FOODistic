type Rows = {
  [x: string]: any;
  rows: [Row]
};
type Row = {
  name: string,
  value: string,
}
export class DBService {
    async query(query: string) {
        const res = await fetch('http://127.0.0.1:3080/db?query='+encodeURI(query), {
        }).then(function(response) {
            return response.json();
          }).then(function(data) {
            //console.log(data.rows); // this will be a string
            return data;
          });
          return res.rows;
    }
}

export type { Rows, Row }