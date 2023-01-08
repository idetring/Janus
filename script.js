/*----------- Constants and Classes  ----------*/

const colors = ['green', 'red', 'orange', 'purple'];
const Player_color = ['red','black','blue' ,'green'];
const Player_start = [0, 9, 99, 90];

const Tile = class {
    constructor(html, color,  moves) {
        this.html = html;
        this.color = color;
        this.moves = moves;
        this.janus = false;
        this.directions = [];
    }
}

const Janus = class {
    constructor(position,html,color,moves) {
        this.position = position;
        this.html = html;
        this.color = color;
        this.moves = moves;
        this.directions = [];
    }
}

const TileGroup = class {
    constructor(tiles, points) {
        this.tiles = tiles; // list of tiles
        this.occupied = null; // Player
        this.occupiedby = null; // Player
        this.points = points; // int
    }
}

const Player = class {
    constructor(name, position, color) {
        this.name = name;   
        this.position = position;
        this.score = 0;
        this.pieces = 15;
        this.color = color;
        this.turn = false;
        this.janus = [];
    }
}

const Board = class {
    constructor(N) {
        this.N = N;
        this.groups = new Map();
        for (let i = 0; i < N*N; i++) {
            let k = Math.floor(i/N/2)%(N/2)*10 + Math.floor(i/2)%(N/2);
            this.groups.set(k,new TileGroup([],1));
        }  
        for (let i = 0; i < N*N; i++) {
            let k = Math.floor(i/N/2)%(N/2)*10 + Math.floor(i/2)%(N/2);
            this.groups.get(k).tiles.push(i.toString()); 
        }
    }
}

const Game = class {
    constructor(N=10,NPlayers=4) {
        this.N = N;
        this.Nplayers = NPlayers;
        this.players = new Map();
        this.scoreboard = new Board(N);
        this.tiles = new Map();
    }

    addPlayer(name) {
        let color = Player_color[this.players.size];
        let position = Player_start[this.players.size];
        let player = new Player(name, position, color);
        this.players.set(this.players.size,player);
    }

    removePlayer(name) {}

    turn() {
        for (let i = 0; i < this.players.size; i++) {
            if (this.players.get(i).turn) {
                return this.players.get(i)
            }
        }
    }

    initTiles() {
        const unorderedcells = document.getElementsByClassName("Cell");
        for (let i = 0; i < unorderedcells.length; i++) {
            let moves = randomIntFromInterval(1,5);
            let cellcolor = colors[randomIntFromInterval(0,3)];
            this.tiles.set(unorderedcells[i].id, new Tile(unorderedcells[i], cellcolor, moves));
        };
        for (let i = 0; i < this.tiles.size; i++) {
            this.tiles.get(zeroPad(i)).html.className = `Cell ${this.tiles.get(zeroPad(i)).color}`;
        }
        let i = 0;
        while (i < 8) {
            let k = randomIntFromInterval(0,99);
            if (!(k in [1,9,90,99]) && this.tiles.get(zeroPad(k)).janus == false) {
                this.tiles.get(zeroPad(k)).janus = true;
                this.tiles.get(zeroPad(k)).html.className = `Cell ${this.tiles.get(zeroPad(k)).color} Janus`;
                this.tiles.get(zeroPad(k)).directions = directions_types[randomElementFromArray(['horizontal','vertical'])]
                i++;
            }
        }

        for (let i = 0; i < this.tiles.size; i++) {
            if (this.tiles.get(zeroPad(i)).janus == false) {
                this.tiles.get(zeroPad(i)).directions = directions_types[randomElementFromArray(['rose'])]
            }
        }

    }

    endGame() {}

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

const rotations = {0:0,1:90,2:180,3:270}

let directions_rotation = {'northwest': {0:'northwest',90:'northeast',180:'southeast',270:'southwest'},
                            'north': {0:'north',90:'east',180:'south',270:'west'},
                            'northeast': {0:'northeast',90:'southeast',180:'southwest',270:'northwest'},
                            'west': {0:'west',90:'north',180:'east',270:'south'},
                            'east': {0:'east',90:'south',180:'west',270:'north'},
                            'southwest': {0:'southwest',90:'southwest',180:'northeast',270:'northwest'},
                            'south': {0:'south',90:'west',180:'north',270:'east'},
                            'southeast': {0:'southeast',90:'southwest',180:'northwest',270:'northeast'}};


dir_types = ['rose','cross'] //,'diagonal','horizontal','vertical']                            
let directions_types = {
    rose : ['northwest', 'north', 'northeast', 'west', 'east', 'southwest', 'south', 'southeast'],
    cross : ['north', 'west', 'east', 'south'],
    diagonal : ['northwest', 'northeast', 'southwest', 'southeast'],
    horizontal : ['west', 'east'],
    vertical : ['north', 'south'],
};


const stringWithPlaceholders = 'Player: {name} \n\ Janus: {janus} \n\ Score: {score} \n\ Coins: {pieces}';

/* ---------- Principle Functions ----------*/

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

function randomElementFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomElementFromObject(object) {
    //return the keys of the map Map as an array
    let keys = Array.from( Object.keys(object) );
    return object[randomElementFromArray(keys)];
}

function randomGaussianNumber(mean=0, stdev=1) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}

const zeroPad = (num) => String(num).padStart(2, '0')

function IndexToGroup(index) {
    let N = ScoreBoard.N;
    let k = Math.floor(index/N/2)%(N/2)*10 + Math.floor(index/2)%(N/2);
    return k;
}

function rotate(directions,rotate) {
    let out = []; 
    for (let i = 0; i < directions.length; i++) {
        out[i] = directions_rotation[directions[i]][rotate];
    }
    return out;
}

function random_rotate(directions) {
    let rotate = randomElementFromMap(rotations);
    // rotate each direction in rotation and return the new direction
    return rotate(directions,rotate);
}

/*----------- Players and functions  ----------*/

function initGame() {
    GameState = new Game()
    let playernames = ['Igor','not Igor','totally not Igor','soon Igor']
    for (let i = 0; i < playernames.length; i++) {
        GameState.addPlayer(playernames[i])
    }
    console.log(GameState.players)
    GameState.players.get(0).turn = true;

    GameState.initTiles()
    //console.log(GameState.players.get(0).turn)
    let whosturnisit = GameState.turn()
    console.log(whosturnisit)
    return GameState
}

GameState = initGame()
Players = GameState.players
NPlayers = Players.size
ScoreBoard = GameState.scoreboard
cells = GameState.tiles
console.log(cells)

//set randomly one players turn to true
//Players.get(randomIntFromInterval(0,Players.size-1)).turn = true;
console.log(cells)
console.log(cells)
Players.get(0).turn = true;

function getPlayersPosition () {
    playersPosition = new Array(Players.size);
    for (let i = 0; i < playersPosition.length; i++) {
        playersPosition[i] = Players.get(i).position;
    }
    return playersPosition;
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

let playerNr = function() {
    for (let i = 0; i < Players.size; i++) {
        if (Players.get(i).turn) {
            return i
        }
    }
}

/*---------- Prepare Game Variables ----------*/

// add a text to the html whos turn it is
const TurnText = document.getElementsByClassName("turn-text");
TurnText[0].style.color = `${playerTurn().color}`;
TurnText[0].innerHTML = `It is ${playerTurn().name}'s turn`;

const PlayerText = document.getElementsByClassName("player-text");

// add players' pieces to the board
for (let i = 0; i < NPlayers; i++) {
    cells.get(zeroPad(Players.get(i).position)).html.innerHTML = `<p class="Player ${Players.get(i).color}"></p>`;
    Players.get(i).piece = document.getElementsByClassName(`Player ${Players.get(i).color}`);
}


// selected piece properties for each turn
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


// add 8 Janus to the board - ideally this should be done randomly, 2 for each color

// add directions others cells


/*---------- Event Listeners ----------*/

// initialize event listeners on pieces
function givePiecesEventListeners() {
    tmp = playerTurn()
    tmp.piece[0].addEventListener("click", getPlayerPieces);
}

/*---------- Logic ----------*/

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

function getSelectedPiece() {
    //whos turn is it
    let player = playerTurn();
    selectedPiece.player = player;
    selectedPiece.indexOfBoardPiece = findPiece(player);
    selectedPiece.indicesOfBoardMatrix = pieceIndices(player);
    selectedPiece.moves = cells.get(zeroPad(selectedPiece.indexOfBoardPiece)).moves;
    for (const [key, value] of Object.entries(cells.get(zeroPad(selectedPiece.indexOfBoardPiece)).directions)) {
        selectedPiece.directions[value] = true;
    }
    getAvailableMoves();
}

function givePieceBorder() {
    selectedPiece.player.piece[0].style.border = "3px solid green";
}

function getAvailableMoves() {
    playersPosition = getPlayersPosition();
    let adjacentcells = [];
    for (const [key, value] of Object.entries(selectedPiece.directions)) {
    // for all directions in selectedPiece that are true
        if (value == true) {
            let dir = directions[key];
            let i = selectedPiece.indicesOfBoardMatrix[0] + dir[0]*selectedPiece.moves;
            let j = selectedPiece.indicesOfBoardMatrix[1] + dir[1]*selectedPiece.moves;
            if (i >= 0 && i <= 9 && j >= 0 && j <= 9) {
                if ( !(playersPosition.includes(i*10+j)) ) {
                    adjacentcells.push(key)
                }
            }
        }
    }
    //check if adjacentcells is empty
    if (adjacentcells.length == 0) {
        console.log("no moves available")
        removeCellBorder();
        resetSelectedPieceProperties();
        removeCellonclick();
        removeEventListeners();
        return; 
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
        selectedPiece.directions[selectedPiece.neighbors[k]] = true;
        cellcolor = cells.get(zeroPad(i*10+j)).color;
        //document.getElementById(zeroPad(i*10+j)).style = `background:radial-gradient(${cellcolor},white)`;
        document.getElementById(zeroPad(i*10+j)).style = "box-sizing:border-box; border: 10px solid grey";
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
        document.getElementById(zeroPad(i*10+j)).setAttribute("onclick", `makeMove(${zeroPad(i*10+j)})`);
    }
}
    
function makeMove(moveto) {
    selectedPiece.player.piece[0].remove();
    let movetopadded = zeroPad(moveto);
    cells.get(movetopadded).html.innerHTML = "";
    cells.get(movetopadded).html.innerHTML = `<p class="Player ${selectedPiece.player.color}" id="${selectedPiece.pieceId}"></p>`;
    let indexOfPiece = selectedPiece.indexOfBoardPiece
    removeCellBorder();
    changeData(indexOfPiece, moveto);

}

function changeData(indexOfBoardPiece, modifiedIndex) {
    cells.get(zeroPad(indexOfBoardPiece)).html.className = "Cell Empty"
    //check if cell has janus
    if (cells.get(zeroPad(indexOfBoardPiece)).janus) {
        // add cell color to players janus
        selectedPiece.player.janus.push(cells.get(zeroPad(indexOfBoardPiece)).color);
    }
    // remove tile from board 
    removeTileFromBoard(indexOfBoardPiece);

    selectedPiece.player.position = modifiedIndex;
    cells.get(zeroPad(indexOfBoardPiece)).moves = 1;
    cells.get(zeroPad(indexOfBoardPiece)).janus = false;
    cells.get(zeroPad(indexOfBoardPiece)).directions = directions_types['rose']
    cells.get(zeroPad(indexOfBoardPiece)).color = "white";
    resetSelectedPieceProperties();
    removeCellonclick();
    removeEventListeners();
}

function removeTileFromBoard(indexOfBoardPiece) {
    // remove tile from board
    let k = IndexToGroup(indexOfBoardPiece)
    console.log(k)
    let index = ScoreBoard.groups.get(k).tiles.indexOf(indexOfBoardPiece.toString())
    if ( index > -1 ) {
        ScoreBoard.groups.get(k).tiles.splice(index, 1);
    }
    if (ScoreBoard.groups.get(k).tiles.length == 0) {
        if ( ScoreBoard.groups.get(k).occupiedby === null ) {
            ScoreBoard.groups.get(k).occupiedby = selectedPiece.player;
            selectedPiece.player.score += ScoreBoard.groups.get(k).points;
            selectedPiece.player.pieces -= 1;
            return;
        }
        else if ( ScoreBoard.groups.get(k).occupiedby !== selectedPiece.player ) {
            ScoreBoard.groups.get(k).occupiedby.score += 1;
            selectedPiece.player.pieces -= 1 ;
            return;
        }
    }
}

function removeEventListeners() {
    tmp = playerTurn()
    tmp.piece[0].removeEventListener("click", getPlayerPieces);
    changePlayer();
}

// change players turn if the player has not the janus of the cells color
function changePlayer() {
    tmp = playerNr();
    /* check if the new position of the player has a color of the players janus */
    if ( !playerTurn().janus.includes(cells.get(zeroPad(playerTurn().position)).color) ) {
        Players.get(tmp).turn = false;
        Players.get((tmp+1)%NPlayers).turn = true;
    }
    
    TurnText[0].innerHTML = `It is ${playerTurn().name}'s turn`;
    TurnText[0].style.color = `${playerTurn().color}`;

    for (let i = 0; i < NPlayers; i++) {
        janustext = "<table><tr>";
        for (let j = 0; j < Players.get(i).janus.length; j++) {
            janustext += `<td class="Cell `+ Players.get(i).janus[j] +` Janus"></td>`;
            console.log(janustext)
        }
        janustext += "</tr></table>";
        PlayerText[i].innerHTML = "Player: " + Players.get(i).name + " " + janustext + " Chips: " + Players.get(i).pieces +" Score: " + Players.get(i).score;
    }

    givePiecesEventListeners();
}

givePiecesEventListeners();