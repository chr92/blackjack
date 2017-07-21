class Card {
    constructor(name, suit) {
        this.name = name;
        this.suit = suit;
    }

    name() {
        return (this.name);
    }

    suit() {
        return (this.suit);
    }

    value() {
        if (isNaN(parseInt(this.name))) {
            if (this.name == "A") {
                return 11;
            } else if (this.name == "J" || this.name == "Q" || this.name == "K") {
                return 10;
            }
        } else {
            return parseInt(this.name);
        }
    }

    displayValue() {
        var suitIcon = '';
        switch (this.suit) {
            case "D":
                suitIcon = "♦";
                break;
            case "H":
                suitIcon = "♥";
                break;
            case "C":
                suitIcon = "♣";
                break;
            case "S":
                suitIcon = "♠";

        }
        return (this.name + " " + suitIcon);
    }
}

class Deck {
    constructor() {
        var suits = ["D", "H", "C", "S"];
        var ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        this.cards = new Array(suits.length * ranks.length);
        for (var i = 0; i < suits.length; i++) {
            for (var j = 0; j < ranks.length; j++)
                this.cards[j + i * ranks.length] = new Card(ranks[j], suits[i]);
        }
    }

    shuffle(times) {
        while (times > 0) {
            for (var i = 0; i < this.cards.length - 1; i++) {
                var j = i + Math.floor(Math.random() * (this.cards.length - i));
                var temp = this.cards[j];
                this.cards[j] = this.cards[i];
                this.cards[i] = temp;
            }
            times--;
        }
    }

    deal() {
        return this.cards.pop();
    }

    remainingCards() {
        return this.cards.length;
    }
}

var Hand = function() {
    var cards = [];
    cards.push(deck.deal(), deck.deal());

    this.returnHand = function() {
        return cards;
    };

    this.score = function() {
        var score = 0;
        var cardValue = 0;
        var aceCount = 0;
        for (var i = 0; i < cards.length; i++) {
            cardValue = cards[i].value();
            if (cardValue == 11) {
                aceCount += 1;
            }
            score += cardValue;
        }

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount -= 1;
        }

        return score;
    };

    this.getCard = function() {
        cards.push(deck.deal());
    };

    this.showCards = function() {
        var currentHand = [];
        for (var i = cards.length - 1; i >= 0; i--) {
            currentHand.push(cards[i].displayValue());
        }
        return currentHand;
    };
};

// GAME

var deck = new Deck();
deck.shuffle(4);



