const sceneNewGame = document.getElementById("newgame");
const sceneGameboard = document.getElementById("gameboard");

const gameoverDialog = document.getElementById("gameover");
const confirmResetDialog = document.getElementById("confirm-restart");

const btnSelectX = document.getElementById("player-x");
const btnSelectO = document.getElementById("player-o");
const btnStartSingle = document.getElementById("single");
const btnStartMulti = document.getElementById("multi");

// const btnReset = document.getElementById("reset");

const scoreXElement = document.getElementById("score-x");
const scoreTieElement = document.getElementById("score-ties");
const scoreOElement = document.getElementById("score-o");

const fieldElements = document.querySelectorAll("[data-field]");

let scoreX = 0;
let scoreTies = 0;
let scoreO = 0;

let selectedPlayer = document.querySelector("#player-x.active, #player-o.active").id;

let currentTurn = "player-x";
sceneGameboard.setAttribute("data-turn", currentTurn);

let fields = new Array(9).fill('');

let winner = "";

let mode = "";

btnSelectX.addEventListener("click", e => {
    btnSelectX.classList.add("active");
    btnSelectX.disabled = true;
    btnSelectO.classList.remove("active");
    btnSelectO.disabled = false;
    selectedPlayer = btnSelectX.id;
});
btnSelectO.addEventListener("click", e => {
    btnSelectX.classList.remove("active");
    btnSelectX.disabled = false;
    btnSelectO.classList.add("active");
    btnSelectO.disabled = true;
    selectedPlayer = btnSelectO.id;
});

btnStartSingle.addEventListener("click", e => {
    sceneNewGame.style.display = "none";
    sceneGameboard.style.display = "grid";

    scoreXElement.querySelector(".title").textContent = "X (CPU)"; 
    scoreOElement.querySelector(".title").textContent = "O (CPU)";

    document.querySelector("#score-" + selectedPlayer.split("player-").pop() + " .title").textContent = selectedPlayer.split("player-").pop() + " (YOU)";

    sceneGameboard.setAttribute("data-selected-player", selectedPlayer);

    mode = "single";

    if (mode == "single" && selectedPlayer != currentTurn) { //cpu's turn
        cpu();
    }
});
btnStartMulti.addEventListener("click", e => {
    sceneNewGame.style.display = "none";
    sceneGameboard.style.display = "grid";
    
    scoreXElement.querySelector(".title").textContent = "X (P1)"; 
    scoreOElement.querySelector(".title").textContent = "O (P2)";

    sceneGameboard.setAttribute("data-selected-player", currentTurn);
    
    mode = "multi";
    sceneGameboard.setAttribute("data-mode", mode);
});

// btnReset.addEventListener("click", e => {
//     resetGame();
// });

const gameFields = document.querySelectorAll("[data-field]");

gameFields.forEach(field => field.addEventListener("click", e => {
    if (field.classList.contains("icon-x") || field.classList.contains("icon-o")) return;
    field.disabled = true;
    
    field.classList.add("icon-" + currentTurn.split("player-").pop());
    fields[field.getAttribute("data-field")] = currentTurn.split("player-").pop()
    
    for (let i = 0; i < 3; i++) {
        // 3 vertical
        if (fields[0 + i] != ""
        &&  fields[0 + i] == fields[3 + i]
        &&  fields[3 + i] == fields[6 + i]
        ) {
            winner = currentTurn;
            gameover(winner);
            document.querySelector(`[data-field="${i}"]`).classList.add("finished");
            document.querySelector(`[data-field="${3 + i}"]`).classList.add("finished");
            document.querySelector(`[data-field="${6 + i}"]`).classList.add("finished");
        }

        // 3 horizontal
        if (fields[i*3] != ""
        &&  fields[i*3] == fields[i*3 + 1]
        &&  fields[i*3 + 1] == fields[i*3 + 2]
        ) {
            winner = currentTurn;
            gameover(winner);
            document.querySelector(`[data-field="${i * 3}"]`).classList.add("finished");
            document.querySelector(`[data-field="${i * 3 + 1}"]`).classList.add("finished");
            document.querySelector(`[data-field="${i * 3 + 2}"]`).classList.add("finished");
        }
    }

    // diagonal lt2rb
    if (fields[0] != ""
    &&  fields[0] == fields[4]
    &&  fields[4] == fields[8]
    ) {
        winner = currentTurn;
        gameover(winner);
        document.querySelector(`[data-field="${0}"]`).classList.add("finished");
        document.querySelector(`[data-field="${4}"]`).classList.add("finished");
        document.querySelector(`[data-field="${8}"]`).classList.add("finished");
    }
    
    // diagonal rt2lb
    if (fields[2] != ""
    &&  fields[2] == fields[4]
    &&  fields[4] == fields[6]
    ) {
        winner = currentTurn;
        gameover(winner);
        document.querySelector(`[data-field="${2}"]`).classList.add("finished");
        document.querySelector(`[data-field="${4}"]`).classList.add("finished");
        document.querySelector(`[data-field="${6}"]`).classList.add("finished");
    }

    if (winner === "player-x") {
        scoreXElement.querySelector(".score").textContent = ++scoreX;
        return;
    } else if (winner === "player-o") {
        scoreOElement.querySelector(".score").textContent = ++scoreO;
        return;
    } else if (!fields.includes("")) {
        winner = "tie";
        scoreTieElement.querySelector(".score").textContent = ++scoreTies;
        gameover(winner);
        return;
    }
    currentTurn = currentTurn === "player-x" ? "player-o" : "player-x";
    sceneGameboard.setAttribute("data-turn", currentTurn);

    if (mode == "single" && selectedPlayer != currentTurn) { //cpu's turn
        cpu();
    }
}));

function nextGame() {   
    gameFields.forEach(field => {
        field.classList.remove("finished");
        field.removeAttribute("class");
        field.disabled = false;
    });
    
    fields = new Array(9).fill('');
    winner = "";

    currentTurn = "player-x";
    sceneGameboard.setAttribute("data-turn", currentTurn);

    if (mode == "single" && selectedPlayer != currentTurn) { //cpu's turn
        cpu();
    }

}

function resetGame() {
    sceneNewGame.style.display = "grid";
    sceneGameboard.style.display = "none";

    
    gameFields.forEach(field => {
        field.classList.remove("finished");
        field.removeAttribute("class");
        field.disabled = false;
    });
    
    fields = new Array(9).fill('');
    winner = "";

    mode = "";

    currentTurn = "player-x";
    sceneGameboard.setAttribute("data-turn", currentTurn);

    scoreX = 0;
    scoreTies = 0
    scoreO = 0;
    scoreXElement.querySelector(".score").textContent = scoreX;
    scoreOElement.querySelector(".score").textContent = scoreTies;
    scoreTieElement.querySelector(".score").textContent = scoreO;

    sceneGameboard.removeAttribute("data-mode");
}

function gameover(winner) {
    fieldElements.forEach(field => field.disabled = true);
    gameoverDialog.querySelector("#result").classList.remove("winner-x");
    gameoverDialog.querySelector("#result").classList.remove("winner-o");
    if (winner == "tie") {
        gameoverDialog.querySelector("#result-small").textContent = "";
        gameoverDialog.querySelector("#result").textContent = "Round tied";
    } else if (winner == "player-x") {
        gameoverDialog.querySelector("#result").classList.add("winner-x");
        gameoverDialog.querySelector("#result").textContent = "TAKES THE ROUND";
        if (mode == "single" && winner == selectedPlayer) {
            gameoverDialog.querySelector("#result-small").textContent = "You won!";
        } else if (mode == "single" && winner != selectedPlayer) {
            gameoverDialog.querySelector("#result-small").textContent = "Oh no, you lost";
        } else {
            gameoverDialog.querySelector("#result-small").textContent = "Player 1 wins!";
        }
    } else if (winner == "player-o") {
        gameoverDialog.querySelector("#result").classList.add("winner-o");
        gameoverDialog.querySelector("#result").textContent = "TAKES THE ROUND";
        if (mode == "single" && winner == selectedPlayer) {
            gameoverDialog.querySelector("#result-small").textContent = "You won!";
        } else if (mode == "single" && winner != selectedPlayer) {
            gameoverDialog.querySelector("#result-small").textContent = "Oh no, you lost";
        } else {
            gameoverDialog.querySelector("#result-small").textContent = "Player 2 wins!";
        }
    }

    // gameoverDialog
    setTimeout(()=>gameoverDialog.showModal(),900);
}

let f = false;
document.querySelectorAll(`[data-action="reset"]`).forEach(btn => btn.addEventListener("click", e => {
    if(btn.id == "reset") {
        f = true;
    } else {
        f = false;
    }
    gameoverDialog.close();
    confirmResetDialog.showModal();
}));
document.querySelectorAll(`[data-action="confirm-restart"]`).forEach(btn => btn.addEventListener("click", e => {
    confirmResetDialog.close();
    gameoverDialog.close();
    resetGame();
}));
document.querySelectorAll(`[data-action="next-round"]`).forEach(btn => btn.addEventListener("click", e => {
    if (winner != "") {
        gameoverDialog.close();
        confirmResetDialog.close();
        nextGame();
    } else {
        gameoverDialog.close();
        confirmResetDialog.close();
    }
}));

function cpu() {
    console.log("cpu");
    fieldElements.forEach(field => field.disabled = true);
    let aaa = [];
    fields.forEach((item, i) => {
        item == "" && aaa.push(i)
    })
    setTimeout(()=>{
        document.querySelector(`[data-field="${aaa[Math.floor(Math.random()*aaa.length)]}"]`).dispatchEvent(new Event('click'));
        fieldElements.forEach(field => field.disabled = false);
    }, 600)
}


// setInterval(() => {
//     debug.textContent = `
//     selectedPlayer: ${selectedPlayer}
//     currentTurn: ${currentTurn}
//     fields: ${fields}
//     winner: ${winner}
//     scoreX: ${scoreX}
//     scoreTies: ${scoreTies}
//     scoreO: ${scoreO}
//     mode: ${mode}
//     `
// }, 50);



// this is just for the progress animation - so it wouldn't flicker on page load
window.onload = () => {
    document.body.classList.add("loaded");
};