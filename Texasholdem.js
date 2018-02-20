class Texasholdem {
    /*
        Class "Interface"
        constructor
        addPlayer(Player)
        prepareRound()
        dealCards()
        getNextBetter() returns Player
        getPlayerOptions(Player) return list of options
        makeMove(Player, move)
        drawFlop()
        drawTurn()
        drawRiver()
        getRoundWinner() returns Player
        getMoneyAllocation()
        getWinner() return Player
        getModel()
    */
    constructor(playerStack = 1000000, minimumBet = 1000) {
        this.playerStack = playerStack;
        this.dealer = null;
        this.minimumBet = minimumBet;
        this.totalPlayers = 0;
        this.deck;
        this.currentBetter = null;
        this.currentBet;
        this.gameState = 'ready';
    }

    addPlayer(playerId) {
        if(!Number.isInteger(playerId))
            throw `Error: ${playerId} is not a valid playerId`;
        var newPlayer = {
            playerId: playerId,
            money: this.playerStack,
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

    prepareRound() {
        if(this.gameState !== 'ready')
            throw `Error: Cannot prepare round during ${this.gameState} phase`
        this.deck = new Deck();
        this.deck.shuffle();
        
        this.dealer.next.bet = this.minimumBet/2;
        this.dealer.next.next.bet = this.minimumBet;
        this.currentBet = this.minimumBet;
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
                playerId: currentPlayer.playerId,
                role: role,
                money: currentPlayer.money,
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

    dealCards() {
        if(this.gameState !== 'ready')
            throw `Error: Cannot deal cards during ${this.gameState} phase`;
        
        var currentPlayer = this.dealer.next;
        for(let i = 0; i < this.totalPlayers*2; i++) {
            currentPlayer.hand.push(this.deck.draw());
            currentPlayer = currentPlayer.next;
        }
        this.currentBetter = this.dealer.next.next.next;
        this.gameState = 'preflop';
    }

    getCurrentBetter() {
        if(this._numberOfValidPlayersLeft() < 2)
            return null;
        while(this.currentBetter.move === 'fold' || this.currentBetter.move === 'allin' || this.currentBetter.money === 0) {
            this.currentBetter = this.currentBetter.next;
        }
        
        return this.currentBetter;
    }

    getCurrentBetterOptions() {
        if(this._numberOfValidPlayersLeft() < 2)
            return null;
        while(this.currentBetter.move === 'fold' || this.currentBetter.move === 'allin' || this.currentBetter.money === 0) {
            this.currentBetter = this.currentBetter.next;
        }
        
        let options = ['allin'];
        if(this.currentBetter.bet < this.currentBet) {
            if(this.currentBetter.money > this.currentBet)
                options = options.concat(['call', 'raise']);
            options.push('fold');
        }
        else if(this.currentBetter.move !== null)
            return null;
        else
            options = options.concat(['bet', 'check', 'fold']);
        return {
            playerId: this.currentBetter.playerId,
            options: options
        };
    }

    makeMove(playerId, move, raiseAmount) {
        const currentBetter = this.getCurrentBetterOptions();
        if(currentBetter.playerId !== playerId)
            throw `Error: It is not player${playerId}'s turn`;
        if(currentBetter.options.indexOf(move) < 0)
            throw `Error: ${move} is an invalid move for player${playerId}`;
        if(move === 'raise' || move === 'bet') {
            if(!Number.isInteger(raiseAmount) || raiseAmount < this.minimumBet)
                throw `Error: Invalid ${move} amount: ${raiseAmount}`;
            if(this.currentBet + raiseAmount > this.currentBetter.money)
                throw `Error: player${playerId} cannot ${move} \$${raiseAmount} with current bet of \$${this.currentBet}. Player only has \$${this.currentBetter.money}`;
        }

        switch(move) {
            case 'fold':
                break;
            case 'raise':
            case 'bet':
                this.currentBet += raiseAmount;
            case 'call':
                this.currentBetter.bet = this.currentBet;
                break;
            case 'allin':

                break;
            case 'check':
                break;
        }
        this.currentBetter.move = move;
        this.currentBetter = this.currentBetter.next;
    }

    _numberOfValidPlayersLeft() {
        let playersLeft = this.totalPlayers;
        let currentPlayer = this.currentBetter;
        for(let i = 0; i < this.totalPlayers; i++) {
            if(this.currentBetter.move === 'fold' || this.currentBetter.move === 'allin' || this.currentBetter.money === 0)
                playersLeft--;
        }
        return playersLeft;
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

    // Change this to socket id or someother
    playerActionById(playerId, action) {
        if(['fold', 'call', 'allin', 'raise', 'bet', 'check'].indexOf(action) < 0)
            return;
        if(this.currentBetter.playerId === playerId) {
            //this.currentBetter.
        }
    }
}

var myTable = new Texasholdem();
myTable.addPlayer(0);
myTable.addPlayer(1);
myTable.addPlayer(2);

myTable.prepareRound();
myTable.dealCards();
let CB = myTable.getCurrentBetterOptions();

myTable.makeMove(CB.playerId, 'call', 99900);

let CB2 = myTable.getCurrentBetterOptions();

myTable.makeMove(CB2.playerId, 'raise', 999000);

let CB3 = myTable.getCurrentBetterOptions();

myTable.makeMove(CB3.playerId, 'allin', 99900);

let CB4 = myTable.getCurrentBetterOptions();
console.log(CB);
console.log(CB2);
console.log(CB3);
console.log(CB4);
console.log(myTable);
