module.exports = class Card {
    constructor(rank, suit) {
        const suits = { Clubs: 0, Diamonds: 1, Hearts: 2, Spades: 3 };
        const ranks = { Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, 
                      Nine: 9, Ten: 10, Jack: 11, Queen: 12, King: 13, Ace: 14 };

        // Check if the given Suit and Rank are valid
        if(!ranks.hasOwnProperty(rank))
            throw Error(`${rank} is not a proper rank for a card`);
        if(!suits.hasOwnProperty(suit))
            throw Error(`${suit} is not a proper suit for a card`);
        this.rank = rank;
        this.suit = suit;
    }

    isLessThan(card) {
        const suits = { Clubs: 0, Diamonds: 1, Hearts: 2, Spades: 3 };
        const ranks = { Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, 
                      Nine: 9, Ten: 10, Jack: 11, Queen: 12, King: 13, Ace: 14 };

        // Check if the card is valid
        if(!(card instanceof Card))
            throw Error(`${card} is not a card.`);

        // First check if this card's rank is lower than the given cards rank or if they're the same, then check the suit value
        if(ranks[this.rank] < ranks[card.rank] ||
           (this.rank === card.rank && suits[this.suit] < suits[card.suit]))
            return true;
        return false;
    }
}