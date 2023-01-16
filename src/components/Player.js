import './Player.css'
import { Component } from "react";
import { BabyJanus } from "./Tile";

export class singlePlayer {
    constructor(name, position, color) {
        this.name = name;   
        this.position = position;
        this.neighbours = [];
        this.score = 0;
        this.pieces = 15;
        this.color = color;
        this.turn = false;
        this.janus = [];
    }
}

export class Player extends Component {
    constructor(props) {
        super(props);
    }

    render() {
    return (
        <p className="Player" style={{backgroundColor:this.props.player.color}} onClick={this.props.onClick}>
        </p>
    );
    }
}

export class PlayerText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let PlayerJanus = this.props.player.janus.map((janus,idx) => { return  (
            <td><BabyJanus color={janus} /></td>)});
    return (
        <div className="PlayerText" style={{fontSize:30,backgroundColor:this.props.player.turn ? this.props.player.color : "grey"}}>
            {this.props.player.name}<br />
            <table><tbody><tr>
            {PlayerJanus} 
            </tr></tbody></table>
            Chips left: {this.props.player.pieces} <br />
            Score: <span > {this.props.player.score} </span> <br />
        </div>
    );
    }
}

export default Player;