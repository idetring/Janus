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

    makeNewBoard(N){
        let newGrid = new Array(N);
        for (let i = 0; i < N; i++) {
          newGrid[i] = new Array(N);
            for (let j = 0; j < N; j++) {
                newGrid[i][j] = new singleTile([i,j],randomElementFromArray(['red','green','orange','purple']),randomElementFromArray([1,2,3,4,5]));
                newGrid[i][j].directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
            }
        }
        let i = 0;
        while (i < 8) {
            let k = randomIntFromInterval(0,9);
            let l = randomIntFromInterval(0,9);
            if (this.isItemInArray([[0,0],[N-1,N-1],[0,N-1],[N-1,0]],[k,l]) === -1 && newGrid[k][l].janus == false) {
                newGrid[k][l].janus = true;
                newGrid[k][l].directions = randomElementFromArray([[[-1,0],[1,0]],[[0,-1],[0,1]]])
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

    onPlayerClick = (player) => {
        console.log(player.position)
    }
    onTileClick = (playerID,newPosition) => {
        let tmpplayer = this.state.player;
        let oldposition = [tmpplayer[playerID].position[0],tmpplayer[playerID].position[1]];
        let g = this.state.grid
        // check if tile is a janus tile
        let tmpcell = g[oldposition[0]][oldposition[1]]
        if (tmpcell.janus) {
            tmpplayer[playerID].janus.push(tmpcell.color)
        }
        // replace old tile with empty tile
        g[oldposition[0]][oldposition[1]] = new singleTile(tmpplayer[playerID].position,'grey',1);
        g[oldposition[0]][oldposition[1]].directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        // move player
        tmpplayer[playerID].position = newPosition;
        // check if player has another turn, if not move to the next player
        if (tmpplayer[playerID].janus.indexOf(g[newPosition[0]][newPosition[1]].color) === -1) {
            tmpplayer[playerID].turn = false;
            tmpplayer[(playerID + 1)%tmpplayer.length].turn = true;
        }
        this.setState({grid:g,player:tmpplayer})
        // 
    } 

    render() {
        const g = this.state.grid;
        const s = this.state.scoreboard;
        console.log(this.state.scoreboard)
        const playerPositions = this.state.player.map(a => a.position)
        const neighbours = g.map((row,i) => 
            row.map((col,j) => {
                let neighbours_ = [];
                for (let l = 0; l < g[i][j].directions.length; l++) {
                    let newNeighbour = [i+g[i][j].directions[l][0]*g[i][j].moves,j+g[i][j].directions[l][1]*g[i][j].moves];
                    if (newNeighbour[0] >= 0 && newNeighbour[0] < this.props.N && newNeighbour[1] >= 0 && newNeighbour[1] < this.props.N) {
                        if (this.isItemInArray(playerPositions,newNeighbour) === -1) {
                                neighbours_.push(newNeighbour);
                        }
                    }
                }
                return neighbours_;
            }));
        
        const playerID = this.state.player.map(a => a.turn).indexOf(true)
        const playerTurn = this.state.player[this.state.player.map(a => a.turn).indexOf(true)]
        const playerNeighbours = neighbours[playerTurn.position[0]][playerTurn.position[1]]
        console.log(playerNeighbours)

        const aboard = g.map((row, i) => { return (
            <tr key={"row_"+i}>
                {row.map((tile, j) => { 
                    const player_ = this.isItemInArray(playerPositions,[i,j]) > -1 ? this.state.player[this.isItemInArray(playerPositions,[i,j])] : null;
                    const availableMove = this.isItemInArray(playerNeighbours,[i,j]) > -1 ? () => this.onTileClick(playerID,[i,j]) : null;
                    return (
                        <Tile key={"tile_"+i+"_"+j} 
                            content={player_ !== null ? <Player player={player_}
                            onClick={player_.turn ? () => this.onPlayerClick(player_) : null}/> : null} 
                            availableMove={availableMove} tile={g[i][j]}>
                        </Tile>
                    )
                })}
            </tr>)
        });

        const board = s.map((grow,gi) => {return (
            <tr key={"grouprow_"+gi}>
                {grow.map((gtile,gj) => { return (
                    <td><table><tbody>
                    {gtile.tile.map((row,i) => { return (
                        <tr>
                            {row.map((tile,j) => {
                                const player_ = this.isItemInArray(playerPositions,[tile[0],tile[1]]) > -1 ? this.state.player[this.isItemInArray(playerPositions,[tile[0],tile[1]])] : null;
                                const availableMove = this.isItemInArray(playerNeighbours,[tile[0],tile[1]]) > -1 ? () => this.onTileClick(playerID,[tile[0],tile[1]]) : null;
                                return (
                                    <Tile key={"tile_"+tile[0]+"_"+tile[1]} 
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
            <td key={"player_"+a.name}>
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