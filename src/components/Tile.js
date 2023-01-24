import react, { Component } from 'react';
import './Tile.css';

export class singleTile {
    constructor(position,color,  moves) {
        this.position = position;
        this.color = color;
        this.moves = moves;
        this.janus = false;
        this.directions = [];
        this.rotation = 0;
    }
}

export class groupTile {
    constructor(i,j,points) {
        let tile = new Array(2)
        for (let k = 0; k < 2; k++) {
          tile[k] = new Array(2);
            for (let l = 0; l < 2; l++) {
                tile[k][l] = [i*2+k,j*2+l];
            }
        }
        this.tile = tile;
        this.color = null;
        this.points = points;
        let visited = new Array(2)
        for (let k = 0; k < 2; k++) {
            visited[k] = new Array(2);
            for (let l = 0; l < 2; l++) {
                visited[k][l] = false;
            }
        }
        this.visited = visited; 
        this.occupiedby = null;
    }
}

export class Tile extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
      }

    render(){
        let class2return = this.props.tile.janus ? "TileJanus" : "Tile" 
        if (this.props.tile.color === 'grey') {
            class2return = "TileEmpty"
        }
        const style = {
            backgroundColor: this.props.tile.color !== 'grey' ? this.props.tile.color : null,
            boxSizing: 'border-box',
            boxShadow: this.props.availableMove !== null ? "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 1) 0px 18px 36px -18px inset" : "",
            //transform : "rotate(" + this.props.tile.rotation + "deg)"
        }
        return (
        <td className={class2return} onClick={this.props.availableMove}
            style={style}>{this.props.tile.color !== "grey" ? this.props.tile.moves : null}{this.props.content}
        </td>
        )
    }
}

export class BabyJanus extends Component {
    constructor(props) {
        super(props);
    }

    render() {
    return (
        <p className="BabyJanus" style={{backgroundColor:this.props.color}}>
        </p>
    );
    }
}

export default Tile;
