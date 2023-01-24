import React, { useState, Component } from 'react';
import { randomElementFromArray,randomIntFromInterval } from '../utils.js'
import { singleTile,groupTile, Tile } from './Tile.js'
import { singlePlayer,PlayerText,Player } from './Player.js'

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid : this.makeNewBoard(props.N),
            player : this.makePlayer(props.Nplayers,props.N),
            scoreboard : this.makeScoreBoard(props.N)
        }
    }

    rotateTile(directions, rotation) {
        let rotated = [];
        for (let i = 0; i < directions.length; i++) {
            let x = directions[i][0];
            let y = directions[i][1];
            let x2 = Math.round(x*Math.cos(rotation) - y*Math.sin(rotation));
            let y2 = Math.round(x*Math.sin(rotation) + y*Math.cos(rotation));
            rotated.push([x2,y2]);
        }
        return rotated;
    }

    makeNewBoard(N){
        let directions = [[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]], // rose
                            [[-1,0],[1,0]], // horizontal
                            [[0,-1],[0,1]], // vertical
                            [[-1,-1],[-1,1],[1,-1],[1,1]], // cross
                            [[-1,0],[0,-1],[0,1],[1,0]], // plus
                            [[-1,0],[1,0],[0,1]], // horizontal
                        ];
        let newGrid = new Array(N);
        for (let i = 0; i < N; i++) {
          newGrid[i] = new Array(N);
            for (let j = 0; j < N; j++) {
                newGrid[i][j] = new singleTile([i,j],randomElementFromArray(['red','green','orange','purple']),randomElementFromArray([1,2,3,4,5]));
                newGrid[i][j].rotation = randomElementFromArray([0,90,180,270]);
                newGrid[i][j].directions = randomElementFromArray(directions);
                newGrid[i][j].directions = this.rotateTile(newGrid[i][j].directions,newGrid[i][j].rotation);
            }
        }
        let i = 0;
        // create 8 Janus tiles... set janus to true, set rotation, set directions, set moves
        while (i < 8) {
            let k = randomIntFromInterval(0,9);
            let l = randomIntFromInterval(0,9);
            if (this.isItemInArray([[0,0],[N-1,N-1],[0,N-1],[N-1,0]],[k,l]) === -1 && newGrid[k][l].janus == false) {
                newGrid[k][l].janus = true;
                newGrid[k][l].rotation = randomElementFromArray([0,90,180,270]);
                newGrid[k][l].directions = [[-1,0],[1,0]]
                newGrid[k][l].directions = this.rotateTile(newGrid[k][l].directions,newGrid[k][l].rotation);
                newGrid[k][l].moves = randomElementFromArray([1,5])
                i++;
            }
        }

        return newGrid;
    }

    makeScoreBoard(N) {
        let newScoreBoard = new Array(N/2);
        for (let i = 0; i < N/2; i++) {
          newScoreBoard[i] = new Array(N/2);
            for (let j = 0; j < N/2; j++) {
                newScoreBoard[i][j] = new groupTile(i,j,randomElementFromArray([1,2,3,4,5]));
            }
        }
        return newScoreBoard;
    }

    makePlayer(NPlayers,N) {
        let letPlayerColors = ['red','blue','black','yellow'];
        let playerStartPositions = [[0,0],[N-1,N-1],[0,N-1],[N-1,0]];
        let newPlayer = new Array(NPlayers);
        for (let i = 0; i < NPlayers; i++) {
          newPlayer[i] = new singlePlayer("player"+i,playerStartPositions[i],letPlayerColors[i]);
        }
        newPlayer[0].turn = true;
        return newPlayer;
    }

    isItemInArray(items, item) {
        for (let i = 0; i < items.length; i++) {
            if (items[i][0] === item[0] && items[i][1] === item[1]) {
                return i;   // Found it
            }
        }
        return -1;   // Not found
    }

    returnScoreCoordinates(x,y) {
        const scorex = Math.floor(x/2);
        const scorey = Math.floor(y/2);
        const tilex = scorex === 0 ? x : x % scorex;
        const tiley = scorey === 0 ? y : y % scorey;
        return [scorex,scorey,tilex,tiley];
    }

    onPlayerClick = (player) => {
        console.log(player.position)
    }
    onTileClick = (playerID,newPosition) => {
        let tmpplayer = this.state.player;
        // that is a very ugly way, but it works
        const [oldx,oldy] = [tmpplayer[playerID].position[0],tmpplayer[playerID].position[1]];
        let [scorex,scorey,tilex,tiley] = this.returnScoreCoordinates(oldx,oldy);
        let g = this.state.grid
        let tmpcell = g[oldx][oldy]
        // check if tile is a janus tile and if so, push janus color to player
        if (tmpcell.janus) {
            tmpplayer[playerID].janus.push(tmpcell.color)
        }
        // clear group tile in scoreboard
        this.state.scoreboard[scorex][scorey].visited[tilex][tiley] = true;
        // check if all tiles in group tile are visited
        let group = this.state.scoreboard[scorex][scorey]
        console.log(group)
        if (group.visited[0][0] && group.visited[0][1] && group.visited[1][0] && group.visited[1][1] && group.occupiedby === null) {
            group.occupiedby = playerID;
            tmpplayer[playerID].score += group.points;
            tmpplayer[playerID].pieces -= 1;
        }
        
        // replace old tile with empty tile
        g[oldx][oldy] = new singleTile(tmpplayer[playerID].position,'grey',1);
        g[oldx][oldy].directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        // move player to newPosition
        tmpplayer[playerID].position = newPosition;

        // check if player has entered a group tile occupied by another player
        let [newscorex,newscorey,newtilex,newtiley] = this.returnScoreCoordinates(newPosition[0],newPosition[1]);
        if (this.state.scoreboard[newscorex][newscorey].occupiedby !== null && this.state.scoreboard[newscorex][newscorey].occupiedby !== playerID) {
            tmpplayer[this.state.scoreboard[newscorex][newscorey].occupiedby].score += 1;
            tmpplayer[playerID].pieces -= 1;
        }

        // check if player has another turn, if not move to the next player
        if (tmpplayer[playerID].janus.indexOf(g[newPosition[0]][newPosition[1]].color) === -1) {
            tmpplayer[playerID].turn = false;
            tmpplayer[(playerID + 1)%tmpplayer.length].turn = true;
        }
        console.log('It is Player ' + (playerID + 1)%tmpplayer.length + '\'s turn')
        this.setState({grid:g,player:tmpplayer})
        // 
    } 

    render() {
        const g = this.state.grid;
        const s = this.state.scoreboard;
        console.log(this.state.scoreboard)
        const playerPositions = this.state.player.map(a => a.position)
        const neighbors = g.map((row,i) => 
            row.map((col,j) => {
                let neighbors_ = [];
                for (let l = 0; l < g[i][j].directions.length; l++) {
                    let newNeighbor = [i+g[i][j].directions[l][0]*g[i][j].moves,j+g[i][j].directions[l][1]*g[i][j].moves];
                    if (newNeighbor[0] >= 0 && newNeighbor[0] < this.props.N && newNeighbor[1] >= 0 && newNeighbor[1] < this.props.N) {
                        if (this.isItemInArray(playerPositions,newNeighbor) === -1) {
                                neighbors_.push(newNeighbor);
                        }
                    }
                }
                return neighbors_;
            }));
        
        const playerID = this.state.player.map(a => a.turn).indexOf(true)
        const playerTurn = this.state.player[this.state.player.map(a => a.turn).indexOf(true)]
        const playerNeighbors = neighbors[playerTurn.position[0]][playerTurn.position[1]]
        console.log(playerNeighbors)

        const board = s.map((grow,gi) => {return (
            <tr>
                {grow.map((gtile,gj) => { return (
                    <td><table className="GroupTile"><tbody>
                    {gtile.tile.map((row,i) => { return (
                        <tr>
                            {row.map((tile,j) => {                              
                                const player_ = this.isItemInArray(playerPositions,[tile[0],tile[1]]) > -1 ? this.state.player[this.isItemInArray(playerPositions,[tile[0],tile[1]])] : null;
                                const availableMove = this.isItemInArray(playerNeighbors,[tile[0],tile[1]]) > -1 ? () => this.onTileClick(playerID,[tile[0],tile[1]]) : null;
                                return (
                                    <Tile
                                        content={player_ !== null ? <Player player={player_}
                                        onClick={player_.turn ? () => this.onPlayerClick(player_) : null}/> : null} 
                                        availableMove={availableMove} tile={g[tile[0]][tile[1]]}>
                                    </Tile>
                                )
                            })}
                        </tr>
                    )})}
                </tbody></table></td>
                )
                })}
            </tr>)
        });

        const playerturn = this.state.player.map(a => {return (
            <td>
                                <PlayerText player={a}/>
            </td>
        )
        })

        return (
            <div className="Board">
                    <table>
                        <tbody>
                            {board}
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                        <tr>
                        {playerturn}    
                        </tr>
                        </tbody>
                    </table>
            </div>
        );
    }
}

export default Board;  