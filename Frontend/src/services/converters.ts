export class Converter {
    static changeStringToArray(value: string) {
        var result = [] as Array<number>;
        for(let char of value) {
            let number = parseInt(char);
            if(number == 0 || number == 1) {
                result.push(number);
            }
        }
        console.log(result);
        return result;
    };
}