var chai = require('chai');
var assert = chai.assert;
var Card = require('../Card.js');
var Hand = require('../Hand.js');

describe('Hand', () => {
    describe('constructor', () => {
        it('should make a take an array of Cards to construct the hand', () => {
            let hand;
            assert.doesNotThrow(() => hand = new Hand(), Error);
            assert.doesNotThrow(() => hand = new Hand([new Card('Ten', 'Diamonds'), new Card('Ace', 'Spades')]), Error);
        });
    });
    describe('#isLessThan(Hand)', () => {
        it('should correctly evaluate if the poker hand has less value than the given poker hand', () => {
            var royalFlush = [new Card('Ace', 'Hearts'), 
                            new Card('King', 'Hearts'), 
                            new Card('Queen', 'Hearts'), 
                            new Card('Jack', 'Hearts'), 
                            new Card('Ten', 'Hearts'),
                            new Card('Two', 'Spades'),
                            new Card('Three', 'Spades')];
            var highStraightFlush = [new Card('King', 'Hearts'), 
                                    new Card('Queen', 'Hearts'), 
                                    new Card('Jack', 'Hearts'), 
                                    new Card('Ten', 'Hearts'),
                                    new Card('Nine', 'Hearts'),
                                    new Card('Two', 'Spades'),
                                    new Card('Three', 'Spades')];
            var lowStraightFlush = [new Card('Queen', 'Hearts'), 
                                new Card('Jack', 'Hearts'), 
                                new Card('Ten', 'Hearts'),
                                new Card('Nine', 'Hearts'),
                                new Card('Eight', 'Hearts'),
                                new Card('Two', 'Spades'),
                                new Card('Three', 'Spades')];
            var quadSetHigh = [new Card('King', 'Hearts'),
                            new Card('King', 'Clubs'),
                            new Card('King', 'Spades'),
                            new Card('King', 'Diamonds'),
                            new Card('Queen', 'Hearts'),
                            new Card('Jack', 'Diamonds'),
                            new Card('Ten', 'Spades')];
            var quadSetLow = [new Card('Nine', 'Hearts'),
                            new Card('Nine', 'Clubs'),
                            new Card('Nine', 'Spades'),
                            new Card('Nine', 'Diamonds'),
                            new Card('Queen', 'Hearts'),
                            new Card('Jack', 'Diamonds'),
                            new Card('Ten', 'Spades')];
            var quadKickerHigh = [new Card('Eight', 'Hearts'),
                            new Card('Eight', 'Clubs'),
                            new Card('Eight', 'Spades'),
                            new Card('Eight', 'Diamonds'),
                            new Card('Ace', 'Hearts'),
                            new Card('Jack', 'Diamonds'),
                            new Card('Ten', 'Spades')];
            var quadKickerLow = [new Card('Eight', 'Hearts'),
                            new Card('Eight', 'Clubs'),
                            new Card('Eight', 'Spades'),
                            new Card('Eight', 'Diamonds'),
                            new Card('Queen', 'Hearts'),
                            new Card('Jack', 'Diamonds'),
                            new Card('Ten', 'Spades')];
            var fullHouseHigh = [new Card('Ace', 'Hearts'),
                                new Card('Ace', 'Diamonds'),
                                new Card('Ace', 'Spades'),
                                new Card('King', 'Hearts'),
                                new Card('King', 'Spades'),
                                new Card('Four', 'Diamonds'),
                                new Card('Three', 'Hearts')];
            var fullHouseLow = [new Card('Queen', 'Hearts'),
                                new Card('Queen', 'Diamonds'),
                                new Card('Queen', 'Spades'),
                                new Card('King', 'Hearts'),
                                new Card('King', 'Spades'),
                                new Card('Four', 'Diamonds'),
                                new Card('Three', 'Hearts')];
            var fullHouseKickerHigh = [new Card('Seven', 'Hearts'),
                                    new Card('Seven', 'Diamonds'),
                                    new Card('Seven', 'Spades'),
                                    new Card('King', 'Hearts'),
                                    new Card('King', 'Spades'),
                                    new Card('Four', 'Diamonds'),
                                    new Card('Three', 'Hearts')];
            var fullHouseKickerLow = [new Card('Seven', 'Hearts'),
                                    new Card('Seven', 'Diamonds'),
                                    new Card('Seven', 'Spades'),
                                    new Card('Nine', 'Hearts'),
                                    new Card('Nine', 'Spades'),
                                    new Card('Four', 'Diamonds'),
                                    new Card('Three', 'Hearts')];
            var flushHigh = [new Card('Ace', 'Hearts'),
                            new Card('Queen', 'Hearts'),
                            new Card('Ten', 'Hearts'),
                            new Card('Eight', 'Hearts'),
                            new Card('Seven', 'Hearts'),
                            new Card('Ace', 'Clubs'),
                            new Card('Four', 'Clubs')];
            var flushLow = [new Card('King', 'Hearts'),
                            new Card('Queen', 'Hearts'),
                            new Card('Ten', 'Hearts'),
                            new Card('Eight', 'Hearts'),
                            new Card('Seven', 'Hearts'),
                            new Card('Ace', 'Clubs'),
                            new Card('Four', 'Clubs')];
            var flushKicker1High = [new Card('Queen', 'Hearts'),
                                new Card('Jack', 'Hearts'),
                                new Card('Ten', 'Hearts'),
                                new Card('Eight', 'Hearts'),
                                new Card('Seven', 'Hearts'),
                                new Card('Ace', 'Clubs'),
                                new Card('Four', 'Clubs')];
            var flushKicker1Low = [new Card('Queen', 'Hearts'),
                                new Card('Two', 'Hearts'),
                                new Card('Ten', 'Hearts'),
                                new Card('Eight', 'Hearts'),
                                new Card('Seven', 'Hearts'),
                                new Card('Ace', 'Clubs'),
                                new Card('Four', 'Clubs')];
            var flushKicker2High = [new Card('Jack', 'Hearts'),
                                new Card('Ten', 'Hearts'),
                                new Card('Eight', 'Hearts'),
                                new Card('Seven', 'Hearts'),
                                new Card('Two', 'Hearts'),
                                new Card('Ace', 'Clubs'),
                                new Card('Four', 'Clubs')];
            var flushKicker2Low = [new Card('Jack', 'Hearts'),
                                new Card('Ten', 'Hearts'),
                                new Card('Seven', 'Hearts'),
                                new Card('Four', 'Hearts'),
                                new Card('Two', 'Hearts'),
                                new Card('Ace', 'Clubs'),
                                new Card('Four', 'Clubs')];
            var flushKicker3High = [new Card('Ten', 'Hearts'),
                                new Card('Nine', 'Hearts'),
                                new Card('Eight', 'Hearts'),
                                new Card('Six', 'Hearts'),
                                new Card('Two', 'Hearts'),
                                new Card('Ace', 'Clubs'),
                                new Card('Four', 'Clubs')];
            var flushKicker3Low = [new Card('Ten', 'Hearts'),
                                new Card('Nine', 'Hearts'),
                                new Card('Eight', 'Hearts'),
                                new Card('Five', 'Hearts'),
                                new Card('Two', 'Hearts'),
                                new Card('Ace', 'Clubs'),
                                new Card('Four', 'Clubs')];
            var flushKicker4High = [new Card('Nine', 'Hearts'),
                                new Card('Eight', 'Hearts'),
                                new Card('Seven', 'Hearts'),
                                new Card('Six', 'Hearts'),
                                new Card('Four', 'Hearts'),
                                new Card('Ace', 'Clubs'),
                                new Card('Four', 'Clubs')];
            var flushKicker4Low = [new Card('Nine', 'Hearts'),
                                new Card('Eight', 'Hearts'),
                                new Card('Seven', 'Hearts'),
                                new Card('Six', 'Hearts'),
                                new Card('Three', 'Hearts'),
                                new Card('Ace', 'Clubs'),
                                new Card('Four', 'Clubs')];
            var straightHigh = [new Card('Ace', 'Hearts'),
                                new Card('King', 'Spades'),
                                new Card('Queen', 'Clubs'),
                                new Card('Jack', 'Diamonds'),
                                new Card('Ten', 'Hearts'),
                                new Card('Four', 'Spades'),
                                new Card('Seven', 'Clubs')];
            var straightLow = [new Card('King', 'Spades'),
                                new Card('Queen', 'Clubs'),
                                new Card('Jack', 'Diamonds'),
                                new Card('Ten', 'Hearts'),
                                new Card('Nine', 'Spades'),
                                new Card('Four', 'Spades'),
                                new Card('Seven', 'Clubs')];

            var royalFlushHand = new Hand(royalFlush);
            var lowStraightFlushHand = new Hand(lowStraightFlush);
            var highStraightFlushHand = new Hand(highStraightFlush);
            var hands = [new Hand(royalFlush),
                    new Hand(highStraightFlush),
                    new Hand(lowStraightFlush),
                    new Hand(quadSetHigh),
                    new Hand(quadSetLow),
                    new Hand(quadKickerHigh),
                    new Hand(quadKickerLow),
                    new Hand(fullHouseHigh),
                    new Hand(fullHouseLow),
                    new Hand(fullHouseKickerHigh),
                    new Hand(fullHouseKickerLow),
                    new Hand(flushHigh),
                    new Hand(flushLow),
                    new Hand(flushKicker1High),
                    new Hand(flushKicker1Low),
                    new Hand(flushKicker2High),
                    new Hand(flushKicker2Low),
                    new Hand(flushKicker3High),
                    new Hand(flushKicker3Low),
                    new Hand(flushKicker4High),
                    new Hand(flushKicker4Low),
                    new Hand(straightHigh),
                    new Hand(straightLow)];
                    
            for(let i = 0; i < hands.length; i++) {
                assert.isFalse(hands[i].isLessThan(hands[i]));
                for(let j = i+1; j < hands.length; j++) {
                    assert.isFalse(hands[i].isLessThan(hands[j]));
                    assert.isTrue(hands[j].isLessThan(hands[i]));
                }
            }
            
        });
    });
});