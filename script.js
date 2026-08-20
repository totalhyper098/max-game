// Carrom Master - Main Game Engine
// Version 1.0

// Game Settings
const GAME_CONFIG = {
    players: 2,
    maxScore: 180,
    turnTime: 20,

    coins: {
        black: 10,
        white: 20,
        pink: 50
    }
};


// Game State
const gameState = {
    currentPlayer: 1,
    scores: {
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0
    },

    coinsLeft: {
        black: 9,
        white: 9,
        pink: 1
    },

    timer: GAME_CONFIG.turnTime,
    gameStarted: false
};


// Start Game
function startGame() {
    gameState.gameStarted = true;
    console.log("Carrom Game Started");

    startTimer();
}


// Turn System
function changeTurn() {

    if(gameState.currentPlayer < GAME_CONFIG.players){
        gameState.currentPlayer++;
    }
    else{
        gameState.currentPlayer = 1;
    }

    gameState.timer = GAME_CONFIG.turnTime;

    console.log(
        "Player Turn:",
        gameState.currentPlayer
    );
}


// Timer System
function startTimer(){

    setInterval(()=>{

        if(gameState.timer > 0){
            gameState.timer--;

            console.log(
                "Time:",
                gameState.timer
            );
        }
        else{
            changeTurn();
        }

    },1000);
}



// Score System
function addScore(player, coin){

    let points = GAME_CONFIG.coins[coin];

    gameState.scores[player] += points;


    console.log(
        player,
        "Score:",
        gameState.scores[player]
    );


    checkWinner(player);
}



// Winner Check
function checkWinner(player){

    if(gameState.scores[player] >= GAME_CONFIG.maxScore){

        console.log(
            player,
            "is Winner!"
        );

        gameState.gameStarted = false;
    }
}



// Shooting Power System
function calculatePower(distance){

    let power = distance * 2;

    if(power > 100){
        power = 100;
    }

    return power;
}



// Initialize
console.log(
    "Carrom Master Engine Loaded"
);
