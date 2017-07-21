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

function checkForEmptyDeck(deck) {
    if (deck.remainingCards() <= 10) {
        deck = new Deck();
        return deck;
    } else {
        return deck;
    }
}

function evaluateGame(playerHand, dealerHand) {
    var myScore = playerHand.score();
    var dealerScore = dealerHand.score();
    if (myScore > 21) {
        result = "bust"
    } else if (myScore <= 21 && playerHand.returnHand().length >= 5) {
        result = "win"
    } else if (dealerScore > 21 || myScore === 21 || myScore > dealerScore) {
        result = "win"
    } else if (dealerScore > myScore) {
        result = "loss"
    } else if (dealerScore === myScore) {
        result = "draw"
    }
    return result;
}

function toggleControls(stage) {
    if (stage === "game") {
        $("#gameFeedback p").text("It's your turn...");
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

function updateHandUI(handInput, user) {
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

function dealerPlay(playerHand, dealerHand) {
    updateHandUI(dealerHand, "dealer");
    while (dealerHand.score() <= 17) {
        dealerHand.hit();
        updateHandUI(dealerHand, "dealer");
    };
    var result = evaluateGame(playerHand, dealerHand);
    gameOver(result);
}

function updateScores(){
    $('#scores').show();
    $("#scores").html("<p>Previous Wins</br>You "+ playerWins +" - Dealer " + dealerWins + "</p>");
}

function gameOver(result) {
    $("#startButton").show();
    $("#inGame").hide();
    switch (result) {
        case "win":
            $("#gameFeedback p").text("You Win! Play again?");
            playerWins++;
            break;
        case "loss":
            $("#gameFeedback p").text("Dealer Wins! Play again?");
            dealerWins++;
            break;
        case "draw":
            $("#gameFeedback p").text("It's a Draw! Play again?");
            break;
        case "bust":
            $("#gameFeedback p").text("You're Bust! Play again?");
            dealerWins++;
            break;

    }
    updateScores();
}

function clearDealer() {
    $('#dealerCards').html("");
}

var deck = new Deck();
var playerWins = 0;
var dealerWins = 0;

$(document).ready(function() {
    var playerHand = new Hand();
    var dealerHand = new Hand();
    $("#start").click(function() {
        deck = checkForEmptyDeck(deck);
        $('#dealer p').text("Dealer's Hand");
        toggleControls("game");
        playerHand = new Hand();
        dealerHand = new Hand();
        updateHandUI(playerHand, "player");
        clearDealer();
    });
    $("#hit").click(function() {
        playerHand.hit();
        updateHandUI(playerHand, "player");
        if (playerHand.score() > 21 || playerHand.returnHand().length  === 5) {
            var result = evaluateGame(playerHand, dealerHand);
            gameOver(result);
        }
    });
    $("#stand").click(function() {
        toggleControls("dealerTurn");
        dealerPlay(playerHand, dealerHand);
    })
});
