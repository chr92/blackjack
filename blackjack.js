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
        this.shuffle(4);
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
        return this.cards;
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

var checkForEmptyDeck = function(deck) {
    if (deck.remainingCards() <= 5) {
        deck = new Deck();
        return deck;
    } else {
        return deck;
    }
}

var evaluateGame = function(myHand, dealerHand) {
    if (myHand.score() > 21 || dealerHand.score() === 21) {
        result = "loss"
    } else if (myHand.score() <= 21 && myHand.returnHand().length >= 5) {
        result = "win"
    } else if (dealerHand.score() > 21 || myHand.score() === 21 || myHand.score() > dealerHand.score()) {
        result = "win"
    } else if (dealerHand.score() > myHand.score()) {
        result = "lose"
    } else if (dealerHand.score() === myHand.score()) {
        result = "draw"
    }
    return result;
}

var toggleControls = function(stage) {
    if (stage === "game") {
        $("#gameFeedback p").text("It's your turn");
        $("#startButton").hide();
        $("#inGame").show();
    } else if (stage === "home") {
        $("#gameFeedback p").text("Click Start Game to begin");
        $("#startButton").show();
        $("#inGame").hide();
    } else if (stage === "dealerTurn") {
        $("#gameFeedback p").text("Please wait while the dealer plays");
        $("#startButton").hide();
        $("#inGame").hide();       
    }
}

var updateHandUI = function(handInput, user) {
    var cards = handInput.returnHand();
    var cardsHTML = ""
    var cardsCount = 0;
    var score = handInput.score();
    for (var i = 0; i < cards.length; i++) {
        var suit = cards[i].suit;
        var name = cards[i].displayValue();
        if (cardsCount == 0) {
            cardsHTML += "<div id=\"card\" class=\"first " + suit + "\"><div id=\"value\">" + name + "</div></div>"
            cardsCount++
        } else {
            cardsHTML += "<div id=\"card\" class=" + suit + "\"><div id=\"value\">" + name + "</div></div>"
            cardsCount++
        }
    }
    if (user == "player") {
        $('#playerCards').html(cardsHTML);
        $('#player p').text("Your Hand (" + score + ")")
    } else if (user == "dealer") {
        $('#dealerCards').html(cardsHTML);
        $('#dealer p').text("Dealer's Hand (" + score + ")")
    }
}

var dealerPlay = function(dealerHand,playerHand) {
    while (dealerHand.score() < 17) {
        dealerHand.hit();
        updateHandUI(dealerHand,"dealer");

    }
    var result = evaluateGame(playerHand, dealerHand);
    gameOver(result);
}

var gameOver = function(result) {
    switch (result) {
        case "win":
            console.log("win");
            break;
        case "loss":
            console.log("loss");
            break;
        case "draw":
            console.log("draw")
            break;

    }    
}

// GAME PLAY

var deck = new Deck();

$("#start").click(function(){
    var playerHand = new Hand();
    var dealerHand = new Hand();
    toggleControls("game");
    updateHandUI(playerHand,"player");
    $("#hit").click(function(){
       playerHand.hit();
       updateHandUI(playerHand, "player")
       if (playerHand.score() > 21) {
            var result = evaluateGame(playerHand, dealerHand);
            gameOver(result);
       }
    });
    $("#stand").click(function(){
        toggleControls("dealerTurn");
        dealerPlay(dealerHand,playerHand);
    })
});



/*
TODO
0) Button clicking
1) User playing flow
2) Dealer Playing flow
3) Checking game
*/