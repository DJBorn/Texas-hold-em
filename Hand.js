class Hand {
    constructor() {
        this.hand = [];
    }

    addCard(card) {
        if(!(card instanceof Card))
            throw `Error: ${card} is not a card.`;
        
    }
}