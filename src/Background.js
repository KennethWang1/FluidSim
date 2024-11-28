import React, { useEffect, useState } from 'react';
import './Background.css';

var nodes = [];
const num = 500;
const XSize = window.innerWidth;
const YSize = window.innerHeight;
const preasure = 0.002;
const viscosity = 0.0001; //viscosity
const timestep = 100;
const prime1 = 8963;
const prime2 = 6907;
const mass = 1;
const radius = 50;
var density = [];

function calcDensity(p) {
    let density = 0;

    for (let i = 0; i < num; i++) {
        density += smoothing(radius,p,nodes[i].location)*mass;
    }

    return density;
}

/*
* A function which returns a value based on the distance between two nodes
* @param {array} r - smoothing radius
* @param {array} p1 - the position of the first node
* @param {array} p2 - the position of the second node
*/
function smoothing(r,p1,p2) {
    const d = Math.max(r - Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2),0);
    const v = Math.PI * (s**5)/10
    return (d**3)/v;
}

class Node {
    constructor(n) {
        this.location = [Math.random()*(XSize-10), Math.random()*(YSize-10)];
        this.velocity = [0,0];
        //this.acceleration = [Math.random()-0.5,Math.random()-0.5];
        this.acceleration = [0,0];
        this.num = n;
        this.forces = [];
        this.color = `hsl(${Math.max(Math.min((255-(Math.abs(Number(this.velocity[0]))+Math.abs(Number(this.velocity[1])))*10),240),0)}, 100%, 50%)`;
    }

    get display() {
        this.color = `hsl(${Math.max(Math.min((255-(Math.abs(Number(this.velocity[0]))+Math.abs(Number(this.velocity[1])))*10),240),0)}, 100%, 50%)`;
        return (
        <div 
            className='node' 
            id={this.num} 
            style={{
                backgroundColor: `${this.color}`,
                left: `${this.location[0]}px`,
                top: `${this.location[1]}px`
            }}
        >
        </div>
        );
    }

    set addAcceleration(acc) {
        this.acceleration[0] += Number(acc[0]) / density[this.num];
        this.acceleration[1] += Number(acc[1]) / density[this.num];
    }

    update() {
        if(this.acceleration[0] === Infinity){
            this.acceleration[0] = 0;
        }
        if(this.acceleration[1] === Infinity){
            this.acceleration[1] = 0;
        }

        this.velocity[0] += this.acceleration[0]/timestep;
        this.velocity[1] += this.acceleration[1]/timestep;
        this.location[0] += this.velocity[0]/timestep;
        this.location[1] += this.velocity[1]/timestep;
        //this.acceleration = [0,0];

        if(this.location[0] < 0){
            this.location[0] = 0;
            this.acceleration[0] *= -0.5;
            this.velocity[0] *= -0.5;
        }

        if(this.location[0] > XSize-10){
            this.location[0] = XSize-10;
            this.acceleration[0] *= -0.5;
            this.velocity[0] *= -0.5;
        }

        if(this.location[1] < 0){
            this.location[1] = 0;
            this.acceleration[1] *= -0.5;
            this.velocity[1] *= -0.5;
        }

        if(this.location[1] > YSize-10){
            this.location[1] = YSize-10;
            this.acceleration[1] *= -0.5;
            this.velocity[1] *= -0.5;
        }
    }
}

function generate() {
    for(let i = 0; i < num; i++) {
        nodes.push(new Node(i));
    }
}
generate();

function Background() {
    const [displayNodes, setDisplayNodes] = useState([]);

    function step() {
        for(let i = 0; i < num; i++) {

        }

        for(let i = 0; i < num; i++) {
            nodes[i].update();
        }

        setDisplayNodes(nodes.map((n) => n.display));
    }

    //useEffect(() => {
        //console.log('worked?');
        //step();
    //}, []);

    const interval = () =>{setInterval(() => {
            step();
        }, 50);
    };
    interval();

    return (
        <div>
            {displayNodes}
        </div>
    );
}

export default Background;