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
                suitIcon = "&diams;";
                break;
            case "H":
                suitIcon = "&hearts;";
                break;
            case "C":
                suitIcon = "&clubs;";
                break;
            case "S":
                suitIcon = "&spades;";

        }
        return (this.name + suitIcon);
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

class Hand {

    constructor() {
        this.cards = [];
        this.cards.push(deck.deal(), deck.deal());
    };

    returnHand() {
        return cards;
    };

    score() {
        var score = 0;
        var cardValue = 0;
        var aceCount = 0;
        for (var i = 0; i < this.cards.length; i++) {
            cardValue = this.cards[i].value();
            if (cardValue == 11) {
                aceCount += 1;
            }
            score += cardValue;
        }

        while (aceCount > 0 && score > 21) {
            score -= 10;
            aceCount -= 1;
        }

        return score;
    };

    hit() {
        this.cards.push(deck.deal());
    };

    showCards() {
        var currentHand = [];
        for (var i = this.cards.length - 1; i >= 0; i--) {
            currentHand.push(this.cards[i].displayValue());
        }
        return currentHand;
    };
};

// TODO TEST THIS FUNCTION
function checkForEmptyDeck(deck) {
    if (deck.remainingCards() <= 5) {
        deck = new Deck();
        return deck;
    } else {
        return deck;
    }
}

var deck = new Deck();
deck.shuffle(4);


