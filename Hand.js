module.exports = class Hand {
    constructor(hand = []) {
        if(!Array.isArray(hand))
            throw Error(`${hand} is not an array`);
        for(let i = 0; i < hand.length; i++)
            if(!(hand[i] instanceof Card))
                throw Error(`${hand[i]} is not a Card`);
        
        this._ranking = 0, this._kicker1 = 0, this._kicker2 = 0, this._kicker3 = 0, this._kicker4 = 0, this._kicker5;
        const suits = { Clubs: 0, Diamonds: 1, Hearts: 2, Spades: 3 };
        const ranks = { Two: 0, Three: 1, Four: 2, Five: 3, Six: 4, Seven: 5, Eight: 6, 
                        Nine: 7, Ten: 8, Jack: 9, Queen: 10, King: 11, Ace: 12 };
        this._hand = [];
        this._handName;
        this._totalCards = 0;
    
        for(let i = 0; i < 4; i++) {
            this._hand[i] = [];
            for(let j = 0; j < 13; j++) {
                this._hand[i][j] = 0;
            }
        }
        for(let i = 0; i < hand.length; i++) {
            this._hand[suits[hand[i].suit]][ranks[hand[i].rank]] = 1;
            this._totalCards++;
        }
        this._setValue();
    }

    addCard(card) {
        if(!(card instanceof Card))
            throw Error(`${card} is not a Card`);
        
        const suits = { Clubs: 0, Diamonds: 1, Hearts: 2, Spades: 3 };
        const ranks = { Two: 0, Three: 1, Four: 2, Five: 3, Six: 4, Seven: 5, Eight: 6, 
                        Nine: 7, Ten: 8, Jack: 9, Queen: 10, King: 11, Ace: 12 };
        this._hand[suits[card.suit]][ranks[card.rank]] = 1;
        this._setValue();
    }

    isLessThan(hand) {
        if(!(hand instanceof Hand))
            throw Error(`${hand} is not a hand`);
        if(this._totalCards < 5)
            throw Error(`Cannot get poker hand value of hand with ${this._hand.length} cards`);
        if(hand.length < 5)
            throw Error(`Cannot get poker hand value of hand with ${hand} cards`);
        if(this._ranking < hand._ranking)
            return true;
        if(this._ranking > hand._ranking)
            return false;
        if(this._kicker1 < hand._kicker1)
            return true;
        if(this._kicker1 > hand._kicker1)
            return false;
        if(this._kicker2 < hand._kicker2)
            return true;
        if(this._kicker2 > hand._kicker2)
            return false;
        if(this._kicker3 < hand._kicker3)
            return true;
        if(this._kicker3 > hand._kicker3)
            return false;
        if(this._kicker4 < hand._kicker4)
            return true;
        if(this._kicker4 > hand._kicker4)
            return false;
        if(this._kicker5 < hand._kicker5)
            return true;
        if(this._kicker5 > hand._kicker5)
            return false;
        return false;
    }

    _setValue() {
        let possibleHands = this._setPossibleHands();
        // Royal Flush
        if(possibleHands['straightflush'].highCard === 12) {
            this._ranking = 10;
            this._handName = 'Royal Flush'
        }
        // Straight Flush
        else if(possibleHands['straightflush'].highCard !== undefined) {
            this._ranking = 9;
            this._kicker1 = possibleHands['straightflush'].highCard;
            this._handName = 'Straight Flush'
        }
        // Four of a kind
        else if(possibleHands['four'].highCard !== undefined) {
            this._ranking = 8;
            this._kicker1 = possibleHands['four'].highCard;
            this._kicker2 = possibleHands['four'].kicker1;
            this._handName = 'Four of a Kind'
        }
        // Full House
        else if(possibleHands['fullhouse'].highCard !== undefined && possibleHands['fullhouse'].kicker1 !== undefined) {
            this._ranking = 7;
            this._kicker1 = possibleHands['fullhouse'].highCard;
            this._kicker2 = possibleHands['fullhouse'].kicker1;
            this._handName = 'Full House'
        }
        // Flush
        else if(possibleHands['flush'].highCard !== undefined) {
            this._ranking = 6;
            this._kicker1 = possibleHands['flush'].highCard;
            this._kicker2 = possibleHands['flush'].kicker1;
            this._kicker3 = possibleHands['flush'].kicker2;
            this._kicker4 = possibleHands['flush'].kicker3;
            this._kicker5 = possibleHands['flush'].kicker4;
            this._handName = 'Flush'
        }
        // Straight
        else if(possibleHands['straight'].highCard !== undefined) {
            this._ranking = 5;
            this._kicker1 = possibleHands['straight'].highCard;
            this._handName = 'Straight'
        }
        // Triple
        else if(possibleHands['triple'].highCard !== undefined) {
            this._ranking = 4;
            this._kicker1 = possibleHands['triple'].highCard;
            this._kicker2 = possibleHands['triple'].kicker1;
            this._kicker3 = possibleHands['triple'].kicker2;
            this._handName = 'Triple'
        }
        // Two Pairs
        else if(possibleHands['twopairs'].highCard !== undefined && possibleHands['twopairs'].kicker1) {
            this._ranking = 3;
            this._kicker1 = possibleHands['twopairs'].highCard;
            this._kicker2 = possibleHands['twopairs'].kicker1;
            this._kicker3 = possibleHands['twopairs'].kicker2;
            this._handName = 'Two Pairs'
        }
        // Pair
        else if(possibleHands['pair'].highCard !== undefined) {
            this._ranking = 2;
            this._kicker1 = possibleHands['pair'].highCard;
            this._kicker2 = possibleHands['pair'].kicker1;
            this._kicker3 = possibleHands['pair'].kicker2;
            this._kicker4 = possibleHands['pair'].kicker3;
            this._handName = 'Pair'
        }
        // High Card
        else if(possibleHands['highcard'].highCard !== undefined) {
            this._ranking = 1;
            this._kicker1 = possibleHands['highcard'].highCard;
            this._kicker2 = possibleHands['highcard'].kicker1;
            this._kicker3 = possibleHands['highcard'].kicker2;
            this._kicker4 = possibleHands['highcard'].kicker3;
            this._kicker5 = possibleHands['highcard'].kicker4;
            this._handName = 'High Card'
        }
    }

    _setPossibleHands() {
        let possibleHands = {};

        let straights = [];

        // Find straight flushes
        for(let i = 0; i < 4; i++) {
            for(let j = 8; j >= 0; j--) {
                // Record straight flushes
                if(this._hand[i][j] && this._hand[i][j+1] && this._hand[i][j+2] && this._hand[i][j+3] && this._hand[i][j+4])
                    straights.push(j+4);
            }
            // Check for A-5 straight
            if(this._hand[i][12] && this._hand[i][0] && this._hand[i][1] && this._hand[i][2] && this._hand[i][3])
                straights.push(3);
        }

        possibleHands['straightflush'] = {
            highCard: straights[0]
        }


        let flushRank = [];
        // Find flushes
        for(let i = 0; i < 4; i++) {
            flushRank[i] = [];
            for(let j = 12; j >= 0; j--) {
                // Record suit count and flush ranks
                if(this._hand[i][j] === 1) {
                    flushRank[i].push(j);
                }
            }
        }

        let potentialFlushes = [];
        // Find faces that are flushes
        for(let i = 0; i < 4; i++)
            if(flushRank[i].length > 4)
                potentialFlushes.push(i);
        let bestFlush = null;
        let bestFace = null, currentHighestRank = 0;

        // Find the best flush out of the 4 faces
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < potentialFlushes.length; j++) {
                // Get the highest rank of all the potential faces
                if(flushRank[potentialFlushes[j]][i] > currentHighestRank) {
                    currentHighestRank = flushRank[potentialFlushes[j]][i];
                    bestFace = potentialFlushes[j];
                }
            }
            // Filter out faces that do not have the current highest rank 
            potentialFlushes = potentialFlushes.filter(n => flushRank[n][i] === currentHighestRank);
            // Reset the highest rank to start from the next highest card
            currentHighestRank = 0;
        }

        possibleHands['flush'] = {};
        if(bestFace !== null) {
            possibleHands['flush'] = {
                highCard: flushRank[bestFace][0],
                kicker1: flushRank[bestFace][1],
                kicker2: flushRank[bestFace][2],
                kicker3: flushRank[bestFace][3],
                kicker4: flushRank[bestFace][4],
            }
        }

        // Find Quads, fullhouses, straights, triples, two pairs, pairs, and high cards
        let rankGroups = [];
        let four = [], straight = [], triple = [], pairs = [], highs = [];
        let straightChain = true;
        // Add the sum of all ranks together
        for(let i = 0; i < 13; i++) {
            rankGroups[i] = 0;
            for(let j = 0; j < 4; j++) {
                rankGroups[i] += this._hand[j][i];
            }
        }
        for(let i = 12; i >= 0; i--) {
            if(rankGroups[i] === 4)
                four.push(i);
            else if(rankGroups[i] === 3)
                triple.push(i);
            else if(rankGroups[i] === 2)
                pairs.push(i);
            else if(rankGroups[i] === 1)
                highs.push(i);
        }

        for(let i = 8; i >= 0; i--) {
            // Record straight flushes
            if(rankGroups[i] && rankGroups[i+1] && rankGroups[i+2] && rankGroups[i+3] && rankGroups[i+4])
                straight.push(i+4);
        }
        // Check for A-5 straight
        if(rankGroups[12] && rankGroups[0] && rankGroups[1] && rankGroups[2] && rankGroups[3])
            straight.push(3);
        
        possibleHands['four'] = {
            highCard: four[0],
            kicker: highs[0]
        }
        possibleHands['fullhouse'] = {
            highCard: triple[0],
            kicker1: pairs[0]
        }
        possibleHands['straight'] = {
            highCard: straight[0]
        }
        possibleHands['triple'] = {
            highCard: triple[0],
            kicker1: highs[0],
            kicker2: highs[1]
        }
        possibleHands['twopairs'] = {
            highCard: pairs[0],
            kicker1: pairs[1],
            kicker2: highs[0]
        }
        possibleHands['pair'] = {
            highCard: pairs[0],
            kicker1: highs[0],
            kicker2: highs[1],
            kicker3: highs[2]
        }
        possibleHands['highcard'] = {
            highCard: highs[0],
            kicker1: highs[1],
            kicker2: highs[2],
            kicker3: highs[3],
            kicker4: highs[4]
        }
        return possibleHands;
    }
}


// let myDeck = new Deck();
// myDeck.shuffle();
// let hand = [];
// let hand2 = [];
// for(let i = 0; i < 20; i++) {
//     hand.push(myDeck.draw());
//     hand2.push(myDeck.draw());
// }
// let pokerHand = new Hand(hand);
// let pokerHand2 = new Hand(hand2);

// console.log(pokerHand.isLessThan(pokerHand2));

//console.log(Hand.getPokerValue(pokerHand));
//console.log(Hand.getStraight(pokerHand));