import React, { Component } from 'react';
import Board from './components/Board';

const gameName    = "Janus"
const gameVersion = "0.0.1"
const gameHome    = "github.com/idetring/Janus"

class Janus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: gameName,
      gameVersion: gameVersion,
      N : 10,
      Nplayers : 2
    }
  };
  render() {
  return (
    <div className="Janus">
      <header className="Janus-header">
        <h1> {this.state.gameName} - v{this.state.gameVersion} </h1>
      </header>
      <Board gameName={this.state.gameName} N={this.state.N} Nplayers={this.state.Nplayers}/>
    </div>
  );
  }
}

export default Janus;
