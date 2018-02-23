class Deck {
    constructor() {
        this.deck = [];
        const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
        const ranks = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];

        // Create standard deck of 52 cards
        for(let i = 0; i < 4; ++i)
            for(let j = 0; j < 13; ++j)
                this.deck.push(new Card(ranks[j], suits[i]));
    }

    // Shuffle the deck
    shuffle() {
        // Use fisher yates algorithm
        for(let i = this.deck.length-1; i > 0; --i) {
            const cardSelection = Math.floor(Math.random()*i) + 1;
            if(cardSelection !== i)
                this._swapCards(cardSelection, i);
        }
    }

    // Draw the last card in the deck
    draw() {
        if(this.deck.length === 0)
            throw Error('There are no cards in this deck');
        return this.deck.pop();
    }

    // Swap cards given their indexes in the deck
    _swapCards(i, j) {
        const temp = this.deck[i];
        this.deck[i] = this.deck[j];
        this.deck[j] = temp;
    }
}