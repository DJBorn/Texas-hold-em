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
});