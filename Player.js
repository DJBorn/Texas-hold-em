class Player {
    constructor(id, name, money) {
        this.id = id;
        this.name = name;
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