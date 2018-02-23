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
        this.communityCards = [];
        this.currentBetter = null;
        this.currentBet;
        this.gameState = 'ready';
        this.bettingRoundStarted = false;
    }

    addPlayer(playerId, money = 1000000) {
        if(!Number.isInteger(playerId))
            throw Error(`${playerId} is not a valid playerId`);
        var newPlayer = {
            playerId: playerId,
            money: money,
            hand: [],
            bet: 0,
            move: null,
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
            throw Error(`Cannot prepare round during ${this.gameState} phase`);
        this.deck = new Deck();
        this.deck.shuffle();
        this.communityCards = [];

        this._resetBetPhase();
    }

    // Remove player by id
    removePlayerById(id) {
        if(!(Number.isInteger(id)))
            throw Error(`${id} must be an integer`);

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
            communityCards: this.communityCards,
            timer: this.timer,
            players: players
        }
        return model;
    }

    dealCards() {
        if(this.gameState !== 'ready')
            throw Error(`Cannot deal cards during ${this.gameState} phase`);

        var currentPlayer = this.dealer.next;
        for(let i = 0; i < this.totalPlayers*2; i++) {
            if(currentPlayer.money > 0)
                currentPlayer.hand.push(this.deck.draw());
            currentPlayer = currentPlayer.next;
        }
        this.gameState = 'preflop';
    }

    getCurrentBetterOptions() {
        if(!this.currentBetter)
            return null;
        if(this._numberOfValidPlayersLeft() < 2 && !this.bettingRoundStarted) {
            this._endBetPhase();
            return null;
        }
        let playersVisited = 0;
        while(this.currentBetter.move === 'fold' || this.currentBetter.move === 'allin' || this.currentBetter.money === 0) {
            this.currentBetter = this.currentBetter.next;
            playersVisited++;
            if(playersVisited === this.totalPlayers) {
                this._endBetPhase();
                return null;
            }
        }

        let options = ['allin'];
        if(this.currentBetter.bet < this.currentBet) {
            if(this.currentBetter.money > this.currentBet)
                options = options.concat(['call', 'raise']);
            options.push('fold');
        }
        else if(this.currentBetter.move !== null) {
            this._endBetPhase();
            return null;
        }
        else
            options = options.concat(['bet', 'check', 'fold']);
        return {
            playerId: this.currentBetter.playerId,
            options: options
        };
    }

    makeMove(playerId, move, raiseAmount) {
        const currentBetter = this.getCurrentBetterOptions();

        if(['preflop', 'flop', 'turn', 'river'].indexOf(this.gameState) < 0)
            throw Error(`Cannot make a move during ${this.gameState} phase`);
        if(currentBetter.playerId !== playerId)
            throw Error(`It is not player${playerId}'s turn`);
        if(currentBetter.options.indexOf(move) < 0)
            throw Error(`${move} is an invalid move for player${playerId}`);
        if(move === 'raise' || move === 'bet') {
            if(!Number.isInteger(raiseAmount) || raiseAmount < this.minimumBet)
                throw Error(`Invalid ${move} amount: ${raiseAmount}`);
            if(this.currentBet + raiseAmount > this.currentBetter.money)
                throw Error(`player${playerId} cannot ${move} \$${raiseAmount} with current bet of \$${this.currentBet}. Player only has \$${this.currentBetter.money}`);
        }

        switch(move) {
            case 'fold':
                break;
            case 'raise':
            case 'bet':
                this.currentBet += raiseAmount;
                if(this.currentBet === this.currentBetter.money)
                    move = 'allin';
            case 'call':
                this.currentBetter.bet = this.currentBet;
                break;
            case 'allin':
                this.currentBetter.bet = this.currentBetter.money;
                if(this.currentBetter.bet > this.currentBet)
                    this.currentBet = this.currentBetter.bet;
                break;
            case 'check':
                break;
        }
        this.currentBetter.move = move;
        this.currentBetter = this.currentBetter.next;
        this.bettingRoundStarted = true;
        //this.getCurrentBetterOptions();
    }

    drawFlop() {
        if(this.gameState !== 'flopReady')
            throw Error(`Cannot draw flop during ${this.gameState} phase`);

        // Burn Card
        this.deck.draw();

        //  this.communityCards.push(new Card('Ace', 'Hearts'));
        //  this.communityCards.push(new Card('King', 'Hearts'));
        //  this.communityCards.push(new Card('Queen', 'Hearts'));
        //  this.communityCards.push(new Card('Jack', 'Hearts'));
        // this.communityCards.push(new Card('Ten', 'Hearts'));
        
        //  this.communityCards.push(new Card('Ace', 'Hearts'));
        //  this.communityCards.push(new Card('Three', 'Hearts'));
        //  this.communityCards.push(new Card('Five', 'Hearts'));
        //  this.communityCards.push(new Card('Eight', 'Hearts'));
        //this.communityCards.push(new Card('Five', 'Hearts'));
        for(let i = 0; i < 3; i++) {
            this.communityCards.push(this.deck.draw());
        }

        // Reset the betting phase
        this._resetBetPhase();

        this.gameState = 'flop';
    }

    drawTurn() {
        if(this.gameState !== 'turnReady')
            throw Error(`Cannot draw turn during ${this.gameState} phase`);

        // Burn Card
        this.deck.draw();

        this.communityCards.push(this.deck.draw());

        // Reset the betting phase
        this._resetBetPhase();

        this.gameState = 'turn';
    }

    drawRiver() {
        if(this.gameState !== 'riverReady')
            throw Error(`Cannot draw river during ${this.gameState} phase`);

        // Burn Card
        this.deck.draw();

        this.communityCards.push(this.deck.draw());

        // Reset the betting phase
        this._resetBetPhase();

        this.gameState = 'river';
    }

    getRankings() {
        let currentPlayer = this.dealer;
        let rankings = [];

        // Create object specifying the player, their hand, the last move they made, and his payout
        for(let i = 0; i < this.totalPlayers; i++) {
            rankings.push({
                player: currentPlayer,
                hand: new Hand([...currentPlayer.hand, ...this.communityCards]),
                move: currentPlayer.move,
                payout: 0
            });
            currentPlayer = currentPlayer.next;
        }

        // Sort the players by their hand, fold being absolutely last
        rankings.sort((player1, player2) => {
            if(player1.hand.isLessThan(player2.hand) || player1.move === 'fold')
                return 1;
            if(player2.hand.isLessThan(player1.hand))
                return -1;
            return 0;
        });

        let currentIndex = 0;
        let rankingGroups = [];
        let groupIndex = 0;
        // Group players if there are any ties
        while(currentIndex < this.totalPlayers) {
            let currentPlayer = rankings[currentIndex];
            rankingGroups[groupIndex] = rankings.filter((player) => {
                let isTie = !player.hand.isLessThan(currentPlayer.hand) && !currentPlayer.hand.isLessThan(player.hand);
                if(isTie)
                    currentIndex++;
                return !player.hand.isLessThan(currentPlayer.hand) && !currentPlayer.hand.isLessThan(player.hand);
            });
            groupIndex++;
        }

        // Sort the groups of ties by how much they bet (lowest to highest)
        for(let i = 0; i < rankingGroups.length; i++) {
            rankingGroups[i].sort((player1, player2) => player1.bet - player2.bet);
        }

        // For each group, take each person (from lowest to highest) and collect his bet from all other
        // lower groups and distribute that evenly to the group from that person and anyone who bet higher than him
        for(let i = 0; i < rankingGroups.length; i++) {
            let moneyTaken = 0;
            for(let j = 0; j < rankingGroups[i].length; j++) {
                // Specify the person who's bet we'll be looking at
                let payReceiver = rankingGroups[i][j];
                let pot = 0;

                // Reduce the amount of money he takes from what he's already collected from previous group members
                payReceiver.player.bet -= moneyTaken;
                // For each other group, collect their money if they can pay it
                for(let k = i+1; k < rankingGroups.length; k++) {
                    for(let l = 0; l < rankingGroups[k].length; l++) {
                        let payer = rankingGroups[k][l]
                        if(payer.player.bet < payReceiver.player.bet) {
                            pot += payer.player.bet;
                            payer.payout -= payer.player.bet;
                            payer.player.bet = 0;
                        }
                        else {
                            pot += payReceiver.player.bet;
                            payer.payout -= payReceiver.player.bet;
                            payer.player.bet -= payReceiver.player.bet;
                        }
                    }
                }

                // Update the total amount of money taken for this group already
                moneyTaken += payReceiver.player.bet;

                // Divide the money by the number of members who bet the same or more as this user
                pot /= rankingGroups[i].length - j;
                // Take remainder and distribute to the lowest betters first
                let spareChips = Math.trunc((pot%1*(rankingGroups[i].length - j)));
                pot = Math.trunc(pot);
                for(let k = j; k < rankingGroups[i].length; k++) {
                    rankingGroups[i][k].payout += pot;
                    if(spareChips > 0) {
                        rankingGroups[i][k].payout++;
                        spareChips--;
                    }
                }
            }
        }

        for(let i = 0; i < rankings.length; i++) {
            rankings[i].player.money += rankings[i].payout;
        }
        console.log(rankingGroups);

        return rankings;
    }

    getWinnerId() {
        let currentPlayer = this.dealer;
        let winnerId = null;
        for(let i = 0; i < this.totalPlayers; i++) {
            if(currentPlayer.money > 0) {
                if(winnerId !== null)
                    return null;
                winnerId = currentPlayer.playerId;
            }
            currentPlayer = currentPlayer.next;
        }
        return winnerId;
    }

    _collectMoney(player, amount, totalNextPlayers) {
        let pot = 0;
        let currentPlayer = player.next;
        // Collect amount from every player
        for(let i = 0; i < totalNextPlayers; i++) {
            if(currentPlayer.bet < amount) {
                pot += currentPlayer.bet;
                currentPlayer.money -= currentPlayer.bet;
                currentPlayer.bet = 0;
            }
            else {
                pot += amount;
                currentPlayer.money -= amount;
                currentPlayer.bet -= amount;
            }
            currentPlayer = currentPlayer.next;
        }
        return pot;
    }

    _resetBetPhase() {
        this.bettingRoundStarted = false;
        let currentPlayer = this.dealer;
        for(let i = 0; i < this.totalPlayers; i++) {
            // If the game is just starting, reset everyones moves, otherwise just reset those who have not folded or allined
            if(this.gameState === 'ready' || (currentPlayer.move !== 'fold' && currentPlayer.move !== 'allin'))
                currentPlayer.move = null;
            // Reset bets, and hands if game is just starting
            if(this.gameState === 'ready') {
                currentPlayer.bet = 0;
                currentPlayer.hand = [];
            }
            currentPlayer = currentPlayer.next;
        }

        // Set the big and small blind bets for new games
        if(this.gameState === 'ready') {
            this.currentBetter = this.dealer.next.next.next;
            this.dealer.next.bet = this.minimumBet/2;
            this.dealer.next.next.bet = this.minimumBet;
            this.currentBet = this.minimumBet;
        }
        else
            this.currentBetter = this.dealer.next;

    }

    _endBetPhase() {
        switch(this.gameState) {
            case 'preflop':
                this.gameState = 'flopReady';
                break;
            case 'flop':
                this.gameState = 'turnReady';
                break;
            case 'turn':
                this.gameState = 'riverReady';
                break;
            case 'river':
                this.gameState = 'ready';
        }
    }

    _numberOfValidPlayersLeft() {
        let playersLeft = this.totalPlayers;
        let currentPlayer = this.dealer;
        for(let i = 0; i < this.totalPlayers; i++) {
            if(currentPlayer.move === 'fold' || currentPlayer.move === 'allin' || currentPlayer.money === 0)
                playersLeft--;
            currentPlayer = currentPlayer.next;
        }
        return playersLeft;
    }

    // Remove player by expected player object in linked list
    _removePlayer(player) {
        if(!player.next || !player.prev || !Number.isInteger(player.playerId))
            throw Error(`${player} is not a Player`);

        // If the player is the dealer, set the dealer to the next player
        if(player.playerId === this.dealer.playerId)
            this.dealer = this.dealer.next;
        player.prev.next = player.next;
        player.next.prev = player.prev;
        this.totalPlayers--;
    }
}

var myTable = new Texasholdem();
myTable.addPlayer(0, 5000);
myTable.addPlayer(1, 10000);

// myTable.prepareRound();
// myTable.dealCards();

// myTable.getCurrentBetterOptions();
// myTable.makeMove(1, 'allin');
// myTable.makeMove(0, 'allin');
// myTable.getCurrentBetterOptions();

// myTable.drawFlop();
// myTable.getCurrentBetterOptions();

// myTable.drawTurn();
// myTable.getCurrentBetterOptions();

// myTable.drawRiver();

// console.log(myTable.getRankings());

// console.log(myTable.getWinnerId());

console.log(myTable);
