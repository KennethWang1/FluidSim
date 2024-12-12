import React, { useEffect, useState } from 'react';
import './Background.css';

var nodes = [];
var adjOld = [];
var adjNew = [];
var hashLookup = [];
const num = 500;
const preasure = 0.002/2;
const viscosity = 0.0001; //viscosity
const p1 = 8963;
const p2 = 6907;
var BSearchMemo = new Map();
//range is 4.675   

function BSearch(target, arr){
    if(BSearchMemo.has(target)){
        return BSearchMemo.get(target);
    }

    let left = 0;
    let right = arr.length - 1;
    let outputIndex = -1;

    while (left <= right) {    
        let mid = Math.floor((left + right) / 2);

        if(target === arr[mid][0]){
            outputIndex = mid;
            right = mid - 1;
        }else if(target < arr[mid][0]){
            right = mid - 1;
        }else{
            left = mid + 1;
        }
    }

    BSearchMemo.set(target, outputIndex);

    return outputIndex;
}

class Node {
    constructor(n) {
        this.location = [Math.random()*(window.innerWidth-10), Math.random()*(window.innerHeight-10)];
        this.velocity = [0,0];
        //this.acceleration = [Math.random()-0.5,Math.random()-0.5];
        this.acceleration = [0,0];
        this.num = n;
        this.forces = [];
        adjNew.push([Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2,n]);
        this.color = `hsl(${Math.max(Math.min((255-(Math.abs(Number(this.velocity[0]))+Math.abs(Number(this.velocity[1])))*10),240),0)}, 100%, 50%)`;

    }

    get display() {
        //this.color = `hsl(${Math.max(Math.min((255-(Math.abs(Number(this.velocity[0]))+Math.abs(Number(this.velocity[1])))*10),240),0)}, 100%, 50%)`;
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
        this.acceleration[0] += Number(acc[0]);
        this.acceleration[1] += Number(acc[1]);
    }

    pushPull(){
        for(var j = 0; j < this.forces.length; j++){
            const i = this.forces[j];
            if(Math.abs(this.location[0]-nodes[i].location[0]) == 0 || Math.abs(this.location[1]-nodes[i].location[1]) == 0){
                nodes[i].addAcceleration = [(this.location[0]>nodes[i].location[0] ? 1 : -1) * preasure * (0.5 * (1/(Math.random()))),
                (this.location[1]>nodes[i].location[1] ? 1 : -1) * preasure * (0.5 * (1/(Math.random())))];
                continue;
            }

            nodes[i].addAcceleration = [(this.location[0]>nodes[i].location[0] ? -1 : 1) * preasure * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[0]-nodes[i].location[0])+5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0),
            (this.location[1]>nodes[i].location[1] ? -1 : 1) * preasure * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[1]-nodes[i].location[1]) + 5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0)];
        }

        this.forces = [];
        
        /*
        for(var i = this.num; i < num; i++){
            if(i == this.num){adjNew.push([Math.round(this.location[0]/10)*p1+Math.round(this.location[1]/10)*p2,this.num]);continue;}

            if(Math.abs(this.location[0]-nodes[i].location[0]) == 0 || Math.abs(this.location[1]-nodes[i].location[1]) == 0){
                nodes[i].addAcceleration = [(this.location[0]>nodes[i].location[0] ? 1 : -1) * preasure * (0.5 * (1/(Math.random()))),
                (this.location[1]>nodes[i].location[1] ? 1 : -1) * preasure * (0.5 * (1/(Math.random())))];
                continue;
            }

            if(preasure * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[0]-nodes[i].location[0])+0.001))-Math.abs(this.location[0]-nodes[i].location[0])-20),0) > 0 || Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[1]-nodes[i].location[1]) + 0.001))-Math.abs(this.location[0]-nodes[i].location[0])-20),0) > 0){
                nodes[i].forces.push(this.num);
                nodes[i].addAcceleration = [viscosity * this.acceleration[0] * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[0]-nodes[i].location[0])+5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0), viscosity * this.acceleration[1] * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[0]-nodes[i].location[0])+5))-Math.abs(this.location[1]-nodes[i].location[1])-20),0)];
            }

            nodes[i].addAcceleration = [(this.location[0]>nodes[i].location[0] ? -1 : 1) * preasure * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[0]-nodes[i].location[0])+5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0),
            (this.location[1]>nodes[i].location[1] ? -1 : 1) * preasure * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[1]-nodes[i].location[1]) + 5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0)];
            //nodes[i].addAcceleration = [viscosity * this.acceleration[0] * Math.max(0.005 * (1/(0.01 * (Math.abs(this.location[0]-nodes[i].location[0])+0.05))-Math.abs(this.location[0]-nodes[i].location[0])-20),0), viscosity * this.acceleration[1] * Math.max(0.05 * (1/(0.02 * (Math.abs(this.location[1]-nodes[i].location[1])+0.5))-Math.abs(this.location[1]-nodes[i].location[1])-5),0)];
            //this.addAcceleration = [(this.location[0]>nodes[i].location[0] ? 1 : -1) * preasure * (0.05 * (1/(0.02 * Math.abs(this.location[0]-nodes[i].location[0])))),(this.location[1]>nodes[i].location[1] ? 1 : -1) * preasure * (0.05 * (1/(0.02 * Math.abs(this.location[1]-nodes[i].location[1]))))];
        }
        */
        this.sumPressure(BSearch(Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
        this.sumPressure(BSearch((Math.round(this.location[0]/100)+1)*p1+Math.round(this.location[1]/100)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
        this.sumPressure(BSearch((Math.round(this.location[0]/100)-1)*p1+Math.round(this.location[1]/100)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
        this.sumPressure(BSearch(Math.round(this.location[0]/100)*p1+(Math.round(this.location[1]/100)+1)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
        this.sumPressure(BSearch(Math.round(this.location[0]/100)*p1+(Math.round(this.location[1]/100)-1)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
        this.sumPressure(BSearch((Math.round(this.location[0]/100)-1)*p1+(Math.round(this.location[1]/100)-1)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
        this.sumPressure(BSearch((Math.round(this.location[0]/100)+1)*p1+(Math.round(this.location[1]/100)-1)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
        this.sumPressure(BSearch((Math.round(this.location[0]/100)-1)*p1+(Math.round(this.location[1]/100)+1)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
        this.sumPressure(BSearch((Math.round(this.location[0]/100)+1)*p1+(Math.round(this.location[1]/100)+1)*p2,adjOld), Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2);
    }

    sumPressure(fi, hash){
        if(fi == -1){
            return;
        }

        while(fi < adjOld.length && adjOld[Number(fi)][0] == hash){
            const i = adjOld[Number(fi)][1];
            if (i <= this.num){fi++;continue;}
            
            if(Math.abs(this.location[0]-nodes[i].location[0]) == 0 && Math.abs(this.location[1]-nodes[i].location[1]) == 0){
                nodes[i].addAcceleration = [(this.location[0]>nodes[i].location[0] ? 1 : -1) * preasure * (0.5 * (1/(Math.random()))),
                (this.location[1]>nodes[i].location[1] ? 1 : -1) * preasure * (0.5 * (1/(Math.random())))];
                fi++;
                continue;
            }

            if(preasure * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[0]-nodes[i].location[0])+5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0) > 0 || Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[1]-nodes[i].location[1]) + 5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0) > 0){
                nodes[i].forces.push(this.num);
            }

            nodes[i].addAcceleration = [(this.location[0]>nodes[i].location[0] ? -1 : 1) * preasure * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[0]-nodes[i].location[0])+5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0),
            (this.location[1]>nodes[i].location[1] ? -1 : 1) * preasure * Math.max(0.05 * (1/(0.0001 * (Math.abs(this.location[1]-nodes[i].location[1]) + 5))-Math.abs(this.location[0]-nodes[i].location[0])-20),0)];
            
            fi++;
        }
    }

    update() {
        adjNew.push([Math.round(this.location[0]/100)*p1+Math.round(this.location[1]/100)*p2,this.num]);
        if(this.acceleration[0]=== Infinity){
            this.acceleration[0] = 0;
        }
        if(this.acceleration[1]=== Infinity){
            this.acceleration[1] = 0;
        }

        this.velocity[0] += this.acceleration[0]/1000;
        this.velocity[1] += this.acceleration[1]/1000;
        this.location[0] += this.velocity[0]/1000;
        this.location[1] += this.velocity[1]/1000;
        //this.acceleration = [0,0];

        if(this.location[0] < 0){
            this.location[0] = 0;
            this.acceleration[0] *= -0.5;
            this.velocity[0] *= -0.5;
        }

        if(this.location[0] > window.innerWidth-10){
            this.location[0] = window.innerWidth-10;
            this.acceleration[0] *= -0.5;
            this.velocity[0] *= -0.5;
        }

        if(this.location[1] < 0){
            this.location[1] = 0;
            this.acceleration[1] *= -0.5;
            this.velocity[1] *= -0.5;
        }

        if(this.location[1] > window.innerHeight-10){
            this.location[1] = window.innerHeight-10;
            this.acceleration[1] *= -0.5;
            this.velocity[1] *= -0.5;
        }
    }
}

generate();
function generate() {
    for(let i = 0; i < num; i++) {
        nodes.push(new Node(i));
    }
}

function Background() {
    const [displayNodes, setDisplayNodes] = useState([]);

    function step() {
        adjOld = adjNew;
        adjOld.sort();
        adjNew = [];
        for(let i = 0; i < num; i++) {
            nodes[i].pushPull();
        }

        for(let i = 0; i < num; i++) {
            nodes[i].update();
        }

        console.log(adjNew);
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