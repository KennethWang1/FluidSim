import React, { useEffect, useState } from 'react';
import './Background.css';
import { typeOf } from 'mathjs';

var Cells = [];
const width = 32;
const height = 32;
const size = 10;
const preasure = 100;
const viscosity = 0.0001; //viscosity
const timestep = 100;//fps
const prime1 = 8963;
const prime2 = 6907;
var first = true;
var addDir = 0;
//x,y (left/top is positive)
//0 is vertical lines, 1 is horizontal
var velocity = [[],[]];

class Cell {
    constructor(n,loc) {
        //"real" location of the cell
        this.loc = loc;
        //(x,y)
        this.location = [loc%width,Math.floor(loc/(width))];
        //cell number (also the location in the cells array)
        this.num = n;
        //number of useable inputs/outputs
        this.numOfChannels = 4;
        //modifiable directions
        this.modifiable = [0,0,0,0];
        //forces
        this.forces = [];
        
        //sets the modifiable directions based on the location of the cell
        //left, top, right, bottom
        if(this.location[0]==0){
            this.modifiable[0] = NaN;
            this.numOfChannels--;
        }else if(this.location[0]==width-1){
            this.modifiable[2] = NaN;
            this.numOfChannels--;
        }
        if (this.location[1]==0){
            this.modifiable[1] = NaN;
            this.numOfChannels--;
        }else if(this.location[1]==height-1){
            this.modifiable[3] = NaN;
            this.numOfChannels--;
        }
    }

    get display() {
        let sum = 0;

        sum += Math.abs(velocity[0][this.num]);
        sum += Math.abs(velocity[1][this.num]);
        sum += Math.abs(velocity[0][this.num+1]);
        sum += Math.abs(velocity[1][this.num+width+1]);

        //console.log(sum);
        const color = `hsl(${Math.max(Math.min((255-(sum)*10),240),0)}, 100%, 50%)`;
        //const color = "rgb(100,100,100)";

        function addVelocity(loc){
            console.log(addDir);
            if(addDir == 0 || addDir == 1){
                Cells[loc].setVelocity = [10,addDir,false];
            }else{
                Cells[loc].setVelocity = [-10,addDir,false];
            }
        }
        
        return (
            <div 
                onClick={()=>{addVelocity(this.loc)}}
                className='Cell'
                id={this.loc} 
                style={{
                    backgroundColor: `${color}`
                }}
            >
            </div>
        );
    }

    get velocity() {    
        return [velocity[0][this.num],velocity[1][this.num],velocity[0][this.num + 1],velocity[1][this.num + width+1]];
    }

    set setVelocity(v){
        console.log(v);
        if(v.length > 2 && v[2]){
            this.modifiable[v[1]] = NaN;
        }
        if(v[1] == 2){
            velocity[0][this.num+1] = v[0];
        }else if (v[1] == 3){
            velocity[1][this.num+width+1] = v[0];
        }else{
            velocity[v[1]][this.num] = v[0];
        }
    }

    equalizeVelocity() {
        let total = 0;
        total += velocity[0][this.num];
        total += velocity[1][this.num];
        total -= velocity[0][this.num+1];
        total -= velocity[1][this.num+width+1];
        
        if(this.loc == width*height/2){
            //console.log(this.velocity, total);
        }

        for(let i = 0; i < 4; i++){
            if(!isNaN(this.modifiable[i])){
                if(i == 2){
                    velocity[0][this.num+1] += total/this.numOfChannels;
                }else if(i == 3){
                    velocity[1][this.num+width+1] += total/this.numOfChannels;
                }else{
                    velocity[i][this.num] -= total/this.numOfChannels;
                }
            }
        }

        if(total > 0.2){
            console.log(total);
        }
    }

    updateVelocity() {
        if(this.location[0]!=0){
            velocity[0][this.num] += velocity[0][this.num+1]/2;
        }
        if(this.location[1]!=0){
            velocity[1][this.num] += velocity[1][this.num+width+1]/2;
        }
        if(this.location[0]!=width-1){
            velocity[0][this.num+1]*=0.5;
        }
        if(this.location[1]!=height-1){
            velocity[1][this.num+width+1]*=0.5;
        }
    }
}

function generate() {
    for(let j = 0; j < (height+1)*(width+1) - 1; j++){
        velocity[0].push(0);
    }
    for(let j = 0; j < (height+1)*(width+1); j++){
        velocity[1].push(0);
    }
    let loc = 0;
    for(let i = 0; i < ((width+1)*(height))-1; i++) {
        if(!((i+1)%(width+1) == 0 && i != 1)){
            //console.log(i);
            Cells.push(new Cell(i,loc));
            loc++;
        }
    }
}
generate();
function drawArrow(loc,velo){
    return (
        <div className="arrow" style={{
            position: "absolute",
            backgroundColor: "white",
            left: `${loc[0]*size+size/2 + 2*size}px`,
            top: `${loc[1]*size+size/2 + 2*size}px`,
            width: `${Math.sqrt(velo[0]**2 + velo[1]**2)/10}px`,
            height: `${Math.sqrt(velo[0]**2 + velo[1]**2)/1}px`,
            transform: `rotate(${Math.atan2(velo[1],velo[0]) + Math.PI/2}rad)`,
            transformOrigin: "50% 0%"
        }}>
            <div className='triangle' style={{
                borderTop: `${Math.sqrt(velo[0]**2 + velo[1]**2)/20*3}px`,
		        borderBottom: `${Math.sqrt(velo[0]**2 + velo[1]**2)/20*3}px`,
                borderLeft:`${Math.sqrt(velo[0]**2 + velo[1]**2)/20*3}px`,  
                transform: `translate(${Math.sqrt(velo[0]**2 + velo[1]**2)/200*7}px,${Math.sqrt(velo[0]**2 + velo[1]**2)}px) rotate(90deg)`,
                transformOrigin: "50% 0%"
            }}>

            </div>
        </div>
    );
}

function seeVelo(){
    var arrows = [];
    for(let i = 0; i < Cells.length; i++){
        var y = (velocity[1][Cells[i].num]+velocity[1][Cells[i].num + width + 1])/2;
        var x = (velocity[0][Cells[i].num + 1]+velocity[0][Cells[i].num])/2;
        arrows.push(drawArrow(Cells[i].location,[x,y]));
    }
    return arrows;
}

/*
1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
33 34 35 36 37 38 39 40 41 42 43 44 45 46 47
49 50 51 52 53 54 55 56 57 58 59 60 61 62 63
*/

function Background() {
    const [displayCells, setDisplayCells] = useState([]);
    const [arrows, setArrows] = useState([]);

    function step() {
        //Cells[0].velocity[1] = 40;
        //console.log(velocity[0].length);
        //Cells[width*height/2].setVelocity = [-10,0,true];
        //Cells[width*height/2 + width/2].setVelocity = [-10,0,true];
        //Cells[width*height/2+width-1].setVelocity = [-10,2,true];
        //Cells[width*height/2 + width/2 + width].setVelocity = [40,0,true];
        let num = width * height;
        for(let j = 0; j < 1; j++){
            for(let i = 0; i < num; i++) {
                Cells[i].equalizeVelocity();
            }
        }

        for(let i = 0; i < num; i++) {
            //Cells[i].updateVelocity();
        }
        setDisplayCells(Cells.map((n) => n.display));
        setArrows(seeVelo());
        first = false;
    }

    let interval = () =>{setInterval(() => {
            step();
        }, 1000/timestep);
    };

    if(first){
        interval();
    }

    return (
        <div>
            <div id = "container" style = {{width :`${width*size}px`,height :`${height*size}px`,gridTemplateColumns:`repeat(${height},${size}px)`}}>
                {displayCells}
                {arrows}
            </div>
            <ArrowButtons/>
        </div>
    );
}

function ArrowButtons(){
    const [Button, setButton] = useState(0);

    const currentDir = Button == 0 ? "<" : Button == 1 ? "^" : Button == 2 ? ">" : "v";

    function up(){
        setButton(1);
    }

    function down(){
        setButton(3);
    }

    function left(){
        setButton(0);
    }

    function right(){
        setButton(2);
    }

    addDir = Button;

    return(
        <div>
            <div>{currentDir}</div>
            <button onClick={up}>^</button>
            <button onClick={down}>v</button>
            <button onClick={right}>&gt;</button>
            <button onClick={left}>&lt;</button>
        </div>
    );
}

export default Background;