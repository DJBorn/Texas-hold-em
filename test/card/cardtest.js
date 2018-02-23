var chai = require('chai');
var expect = chai.expect;
var Card = require('../../Card.js')
var assert = chai.assert;

describe('Card', () => {
    describe('constructor', () => {
        it('should successfully create a card given a proper rank and suit', () => {
            const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
            const ranks = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];
            for(let i = 0; i < suits.length; i++)
                for(let j = 0; j < ranks.length; j++)
                    assert.doesNotThrow(() => new Card(ranks[j], suits[i]), Error);
        });
    });
    describe('#isLessThan(Card)', () => {
        it('should return true if the card is less than the given card', () => {
            const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
            const ranks = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];
            for(let i = 0; i < suits.length; i++) {
                for(let j = 0; j < ranks.length; j++) {
                    const card = new Card(ranks[j], suits[i]);
                    for(let k = 0; k <= i; k++) {
                        for(let l = 0; l <= j; l++) {
                            assert.isFalse(card.isLessThan(new Card(ranks[l], suits[k])));
                        }
                    }
                    for(let k = i+1; k < suits.length; k++) {
                        for(let l = j+1; l < ranks.length; l++) {
                            assert.isTrue(card.isLessThan(new Card(ranks[l], suits[k])));
                        }
                    }
                }
            }
        });
    });
});