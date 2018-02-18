class Player {
    constructor(id, money) {
        this.id = id;
        this.money = money;
    }

    addMoney(pay) {
        if(!(Number.isInteger(pay)))
            throw 'Error: Payment must be an integer';
        if(pay < 0)
            throw 'Error: Cannot pay negative amount to player';
        this.money += pay;
    }
}

var myPlayer = new Player(0, 3);
myPlayer.addMoney(234123);
console.log(myPlayer.money);