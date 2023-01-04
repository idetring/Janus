/*----------- Game State  ----------*/

const colors = ['green', 'red', 'orange', 'purple']

const Tile = class {
    constructor(html, color,  moves) {
        this.html = html;
        this.color = color;
        this.moves = moves;
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }



const NPlayers = 2;
let Players = new Map();
Players.set(0, {name: "Igor", position: 0, score: 0, pieces: 0, color: "red", turn: true});
Players.set(1, {name: "not Igor", position: 9, score: 0, pieces: 0, color: "black", turn: false});




function getPlayersPosition () {
    playersPosition = new Array(Players.size);
    for (let i = 0; i < playersPosition.length; i++) {
        playersPosition[i] = Players.get(i).position;
    }
}
let findPiece = function(player) {
    return player.position
};

let pieceIndices = function(player) {
    let row = Math.floor(player.position / 10);
    let col = player.position % 10;
    return [row,col];
}

// find which player's turn it is from Players map
let playerTurn = function() {
    for (let i = 0; i < Players.size; i++) {
        if (Players.get(i).turn) {
            return Players.get(i)
        }
    }
}

for (let i = 0; i < Players.size; i++) {
    tmp = Players.get(i);
    tmp['piece'] = document.getElementsByClassName(`${Players.get(i).color}-piece`);
}
/*---------- Cached Variables ----------*/

const zeroPad = (num) => String(num).padStart(2, '0')

// DOM referenes
const unorderedcells = document.getElementsByClassName("Cell");
var cells = new Map();
for (let i = 0; i < unorderedcells.length; i++) {
    let moves = randomIntFromInterval(1,5);
    let cellcolor = colors[randomIntFromInterval(0,3)];
    cells.set(unorderedcells[i].id, new Tile(unorderedcells[i], cellcolor, moves));
};
for (let i = 0; i < cells.size; i++) {
    cells.get(zeroPad(i)).html.className = `Cell ${cells.get(zeroPad(i)).color}`;
}

const TurnText = document.getElementsByClassName("turn-text");
TurnText[0].style.color = `${playerTurn().color}`;
TurnText[0].innerHTML = `It is ${playerTurn().name}'s turn`;

for (let i = 0; i < NPlayers; i++) {
    cells.get(zeroPad(Players.get(i).position)).html.innerHTML = `<p class="${Players.get(i).color}-piece"></p>`;
}


// selected piece properties
let selectedPiece = {
    player: null,
    playerID: -1,
    indexOfBoardPiece: -1,
    moves: -1,
    indicesOfBoardMatrix: [0,0],
    neighbors: [],
    directions : {
    'northwest': false,
    'north': false,
    'northeast': false,
    'west': false,
    'east': false,
    'southwest': false,
    'south': false,
    'southeast': false}
}

// directions
let directions = {'northwest': [-1,-1], 
                    'north': [-1,0], 
                    'northeast': [-1,1], 
                    'west': [0,-1], 
                    'east': [0,1], 
                    'southwest': [1,-1], 
                    'south': [1,0], 
                    'southeast': [1,1]};

/*---------- Event Listeners ----------*/

// initialize event listeners on pieces
function givePiecesEventListeners() {
    tmp = playerTurn()
    tmp.piece[0].addEventListener("click", getPlayerPieces);
}

/*---------- Logic ----------*/

// holds the length of the players piece count
function getPlayerPieces() {
    playerPiece = playerTurn().piece[0];
    removeCellonclick();
    resetBorders();
}

function removeCellonclick() {
    for (let i = 0; i < cells.size; i++) {
        cells.get(zeroPad(i)).html.removeAttribute("onclick");
        cells.get(zeroPad(i)).html.removeAttribute("style.brightness")
    }
}

// resets borders to default
function resetBorders() {
    playerPiece.style.border = "1px solid white";
    resetSelectedPieceProperties();
    getSelectedPiece();
}

function resetSelectedPieceProperties() {
    selectedPiece.player = -1;
    selectedPiece.playerID = -1,
    selectedPiece.indexOfBoardPiece = -1,
    selectedPiece.indicesOfBoardMatrix = [0,0],
    selectedPiece.neighbors = [],
    selectedPiece.moves = -1,
    selectedPiece.directions = {
        'northwest': false,
        'north': false,
        'northeast': false,
        'west': false,
        'east': false,
        'southwest': false,
        'south': false,
        'southeast': false}
}


// gets ID and index of the board cell its on
function getSelectedPiece() {
    //whos turn is it
    let player = playerTurn();
    selectedPiece.player = player;
    selectedPiece.indexOfBoardPiece = findPiece(player);
    selectedPiece.indicesOfBoardMatrix = pieceIndices(player);
    selectedPiece.moves = cells.get(zeroPad(selectedPiece.indexOfBoardPiece)).moves;
    getAvailableMoves();
}

function givePieceBorder() {
    selectedPiece.player.piece[0].style.border = "3px solid green";
}


function getAvailableMoves() {
    getPlayersPosition();
    console.log(playersPosition)
    let adjacentcells = [];
    for (const [key, value] of Object.entries(directions)) {
        let dir = directions[key];
        let i = selectedPiece.indicesOfBoardMatrix[0] + dir[0]*selectedPiece.moves;
        let j = selectedPiece.indicesOfBoardMatrix[1] + dir[1]*selectedPiece.moves;
        if (i >= 0 && i <= 9 && j >= 0 && j <= 9) {
            adjacentcells.push(key)
        }
    }
    selectedPiece.neighbors = adjacentcells
    givePieceBorder();
    giveCellBorder();

}

function giveCellBorder() {
    for (let k = 0; k < selectedPiece.neighbors.length; k++) {
        let dir = directions[selectedPiece.neighbors[k]];
        let i = selectedPiece.indicesOfBoardMatrix[0] + dir[0]*selectedPiece.moves;
        let j = selectedPiece.indicesOfBoardMatrix[1] + dir[1]*selectedPiece.moves;
        // if point is not in playersPositions

        if ( !(i*10+j in playersPosition) ) {
            selectedPiece.directions[selectedPiece.neighbors[k]] = true;
            document.getElementById(zeroPad(i*10+j)).style.filter = "brightness(75%)";
        }
    }
    
    giveCellsClick();
}

function removeCellBorder() {
    for (let i = 0; i < cells.size; i++) {
        cells.get(zeroPad(i)).html.removeAttribute("style");
    }
}

function giveCellsClick() {
    for (let k = 0; k < selectedPiece.neighbors.length; k++) {
        let dir = directions[selectedPiece.neighbors[k]];
        let i = selectedPiece.indicesOfBoardMatrix[0] + dir[0]*selectedPiece.moves;
        let j = selectedPiece.indicesOfBoardMatrix[1] + dir[1]*selectedPiece.moves;
        if (!(i*10+j in playersPosition)) {
            document.getElementById(zeroPad(i*10+j)).setAttribute("onclick", `makeMove(${zeroPad(i*10+j)})`);
        }
    }
}
    

// makes the move that was clicked
function makeMove(moveto) {
    selectedPiece.player.piece[0].remove();
    let movetopadded = zeroPad(moveto);
    cells.get(movetopadded).html.innerHTML = "";
    cells.get(movetopadded).html.innerHTML = `<p class="${selectedPiece.player.color}-piece" id="${selectedPiece.pieceId}"></p>`;
    let indexOfPiece = selectedPiece.indexOfBoardPiece
    removeCellBorder();
    changeData(indexOfPiece, moveto);

}

function changeData(indexOfBoardPiece, modifiedIndex) {
    cells.get(zeroPad(indexOfBoardPiece)).html.className = "Cell Empty"
    selectedPiece.player.position = modifiedIndex;
    cells.get(zeroPad(indexOfBoardPiece)).moves = 1;
    resetSelectedPieceProperties();
    removeCellonclick();
    removeEventListeners();
}

function removeEventListeners() {
    tmp = playerTurn()
    tmp.piece[0].removeEventListener("click", getPlayerPieces);
    changePlayer();
}

// Switches players turn

function changePlayer() {
    for (let i = 0; i < Players.size; i++) {
        if (Players.get(i).turn) {
            Players.get(i).turn = false;
            Players.get((i+1)%NPlayers).turn = true;
            break;
        }
    }
    TurnText[0].innerHTML = `It is ${playerTurn().name}'s turn`;
    TurnText[0].style.color = `${playerTurn().color}`;

    givePiecesEventListeners();
}

givePiecesEventListeners();