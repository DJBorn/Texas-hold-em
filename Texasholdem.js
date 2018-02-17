class Texasholdem extends Table {
    constructor() {
        super();
    }

}

var myTable = new Texasholdem();
myTable.addPlayer(new Player(5));
console.log(myTable);

var myPromise = new Promise(function(resolve, reject){
    resolve(prompt("test"));
});
myPromise.then(function(x) {
    console.log(x);
}).catch(function(err) {
    console.log(err);
});
console.log("hello");