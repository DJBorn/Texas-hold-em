var chai = require('chai');
var assert = chai.assert;
var Card = require('../Card.js');
var Deck = require('../Deck.js');

describe('Deck', () => {
    describe('constructor', () => {
        it('should create a list of 52 Cards', () => {
            let deck = new Deck();
            assert.equal(deck.deck.length, 52);
            for(let i = 0; i < deck.deck.length; i++) {
                assert.instanceOf(deck.deck[i], Card);
            }
        });
    });
    describe('#shuffle()', () => {
        it('should shuffle with no errors', () => {
            let deck = new Deck();
            assert.doesNotThrow(() => deck.shuffle(), Error);
        });
    });
    describe('#draw()', () => {
        it('should draw cards if there are cards available', () => {
            let deck = new Deck();
            for(let i = 0; i < 52; i++) {
                let card;
                assert.doesNotThrow(() => {card = deck.draw();}, Error);
                assert.instanceOf(card, Card);
                assert.equal(deck.deck.length, 51 - i);
            }
            assert.throws(() => deck.draw(), Error);
        });
    });
});