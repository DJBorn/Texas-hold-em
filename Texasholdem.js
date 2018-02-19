class Texasholdem {
    constructor(minimumBet) {
        this.dealer = null;
        this.minimumBet = minimumBet;
        this.totalPlayers = 0;
        this.deck = new Deck();
        this.currentBetter = null;
        this.timer = 0;
        this.currentBet;
        this.gameState = 'ready';
    }

    addPlayer(player) {
        if(!(player instanceof Player))
            throw `Error: ${player} is not a Player`;
        if(player.money < this.minimumBet) {
            console.log(`${player} does not have enough money to play`);
            return;
        }
        var newPlayer = {
            playerId: player.id,
            player: player,
            eliminated: false,
            hand: [],
            bet: 0,
            move: null,
            queuedMove: null,
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

    getModel() {
        var model = null;
        var players = null;
        var currentPlayer = this.dealer;
        for(let i = 0; i < this.totalPlayers; i++) {
            let role = 'none';
            let bet = 0;
            if(currentPlayer === this.dealer)
                role = 'dealer';
            else if(currentPlayer.prev === this.dealer)
                role = 'small_blind';
            else if(currentPlayer.prev.prev === this.dealer)
                role = 'big_blind';
            var player = {
                name: currentPlayer.player.name,
                role: role,
                money: currentPlayer.player.money,
                bet: currentPlayer.bet,
                move: currentPlayer.move,
                next: null,
                prev: null
            };
            if(!players) {
                players = player;
                player.next = player;
                player.prev = player;
            } else {
                player.next = players.next;
                player.prev = players;
                player.next.prev = player;
                player.prev.next = player;
            }
            players = players.next;
            currentPlayer = currentPlayer.next
        }
        model = {
            gamePhase: this.gameState,
            currentBet: this.currentBet,
            timer: this.timer,
            players: players
        }
        return model;
    }

    startGame() {
        if(this.gameState !== 'ready')
            return;
        if(this.totalPlayers < 2)
            throw 'Error: Not enough players to start the game';
        this.deck.shuffle();
        
        this.dealer.next.bet = this.minimumBet/2,
        this.dealer.next.next.bet = this.minimumBet;

        this._dealCards();
        this.gameState = 'dealing';
    }

    startPreflop() {
        if(this.gameState !== 'dealing')
            return;
        this.gameState = 'preflop'
        // preflop
        this._initializeBetting();
        this._bettingPhase();
    }

    startFlop() {

    }

    _dealCards() {
        var currentPlayer = this.dealer.next;
        for(let i = 0; i < this.totalPlayers*2; i++) {
            currentPlayer.hand.push(this.deck.draw());
            currentPlayer = currentPlayer.next;
        }
    }

    _bettingPhase() {
        var roundEnded = false;
        while(!roundEnded) {
            if(currentBetter.move === 'allin' || currentBetter.move === 'fold')
                currentBetter = currentBetter.next;
        }
    }

    _waitForPlayer() {

    }

    _initializeBetting() {
        var currentPlayer = this.dealer;
        var playersRemaining = this.totalPlayers;

        // Count how many players are left in the play
        for(let i = 0; i < this.totalPlayers; i++) {
            // Players who have went all in or folded will not get a turn
            if(!(currentPlayer.move === 'allin' || currentPlayer.move === 'fold'))
                currentPlayer.move = null;
            else
                playersRemaining--;
            currentPlayer = currentPlayer.next;
        }
        // If the game is in preflop, then the next better is the player after the Big Blind
        if(this.gameState === 'preflop') {
            this.currentBetter = this.dealer.next.next.next;
            this.currentBet = this.minimumBet;
        }
        else {
            this.currentBetter = this.dealer.next;
        }

        // If there are less than 2 players remaining, then move to the next stage of the game
        if(playersRemaining < 2)
            _setNextStage();
    }

    _setNextStage() {
        if(this.gameState === 'preflop')
            this.gameState = 'drawFlop';
        else if(this.gameState === 'flop')
            this.gameState = 'drawTurn';
        else if(this.gameState === 'turn')
            this.gameState = 'riverDraw';
        else if(this.gameState === 'river')
            this.gameState = 'showdown';
    }

    getTime() {
        return this.timer;
    }

    // Change this to socket id or someother
    playerActionById(playerId, action) {
        if(['fold', 'call', 'allin', 'raise', 'bet', 'check'].indexOf(action) < 0)
            return;
        if(this.currentBetter.playerId === playerId) {
            //this.currentBetter.
        }
    }
}

var myTable = new Texasholdem(2);
myTable.addPlayer(new Player(0, 'Alice', 200));
myTable.addPlayer(new Player(1, 'Bob', 300));
myTable.addPlayer(new Player(2, 'Charlie', 300));
myTable.addPlayer(new Player(3, 'Darius', 200));
myTable.removePlayerById(4);
console.log(myTable);

myTable.startGame();

var myPromise = new Promise(function(resolve, reject){
    setTimeout(() => {
        resolve('hehe');
    }, 1000);
});
myPromise.then(function(x) {
    console.log(x);
}).catch(function(err) {
    console.log(err);
});
console.log('hello');