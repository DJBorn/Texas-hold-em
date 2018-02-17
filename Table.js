class Table {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        if(!(player instanceof Player))
            throw `Error: ${player} is not a Player`;
        this.players.push(player);
    }
}