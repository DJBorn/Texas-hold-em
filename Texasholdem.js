class Texasholdem {
    constructor() {
        this.dealer = null;
        this.totalPlayers = 0;
    }

    addPlayer(player) {
        if(!(player instanceof Player))
            throw `Error: ${player} is not a Player`;
            
        var newPlayer = {
            playerId: player.id,
            player: player,
            eliminated: false,
            prev: null,
            next: null
        }
        if(!this.dealer) {
            this.dealer = newPlayer;
            this.dealer.next = this.dealer;
            this.dealer.prev = this.dealer;
        } else {
            newPlayer.next = this.dealer;
            newPlayer.prev = this.dealer.prev;
            newPlayer.prev.next = newPlayer;
            newPlayer.next.prev = newPlayer;
        }
        this.totalPlayers++;
    }

    // Remove player by expected player object in linked list
    _removePlayer(player) {
        if(!player.next || !player.prev || !Number.isInteger(player.playerId))
            throw `Error: ${player} is not a Player`;

        // If the player is the dealer, set the dealer to the next player
        if(player.playerId === this.dealer.playerId)
            this.dealer = this.dealer.next;
        player.prev.next = player.next;
        player.next.prev = player.prev;
        this.totalPlayers--;
    }

    // Remove player by id
    removePlayerById(id) {
        if(!(Number.isInteger(id)))
            throw `Error: ${id} must be an integer`;

        var currentPlayer = this.dealer;
        for(let i = 0; i < this.totalPlayers; i++) {
            if(currentPlayer.playerId === id)
                this._removePlayer(currentPlayer);
            currentPlayer = currentPlayer.next;
        }

    }
}

var myTable = new Texasholdem();
myTable.addPlayer(new Player(0, 200));
myTable.addPlayer(new Player(1, 300));
myTable.addPlayer(new Player(2, 300));
myTable.addPlayer(new Player(3, 300));
myTable.removePlayerById(3);
console.log(myTable);

// var myPromise = new Promise(function(resolve, reject){
//     resolve(prompt("test"));
// });
// myPromise.then(function(x) {
//     console.log(x);
// }).catch(function(err) {
//     console.log(err);
// });
// console.log("hello");