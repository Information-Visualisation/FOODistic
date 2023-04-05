export class DBService {
    async query(query: string) {
        fetch('http://127.0.0.1:3080/db?query='+encodeURI(query), {
        }).then(function(response) {
            return response.text();
          }).then(function(data) {
            console.log(data); // this will be a string
          });
    }
}