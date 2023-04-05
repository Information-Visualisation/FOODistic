export class FoodService {
    async getAllFoods() {
        fetch('http://127.0.0.1:3080/').then(function(response) {
            return response.text();
          }).then(function(data) {
            console.log(data); // this will be a string
          });
    }
}