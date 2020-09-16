import {
    planetData
} from './planetData.js';


let svgHeight = window.innerHeight - 80;
let svgWidth = 3000;

// define the width of the SVG

const svg = d3.select(".svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// make the SVG a variable


var size = [2439.7, 6051.8, 6371, 3389.5, 69911, 58232, 25362, 24622];
const planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
const colors = ["#d6eff5", "#f7999d", "#aacf9e", "#de7634", "#557fed", "#bb4fbf", "#ff7983", "#77a4c0"];

let distanceFromSun = [
			57910000,
			108200000,
			149600000,
			227900000,
			778500000,
			1434000000,
			2871000000,
			4495000000
		];

// save the planet names with size and distance from sun as separate arrays. 

let xScale = d3.scaleLinear()
    .domain([0, 4495000000]) // scale the distance according to real distance (see distanceFromSun).
    .range([100, svgWidth - 100]); // limit it to the browser width, keep a margin of 100px


const sizeScale = d3.scaleLinear()
    .domain([2439, 24622])
    .range([2, 40]);

// scale the svg planets according to real size, but keep it wihin a range to have it fit the browser winwdow. 	

const text = svg.selectAll("text")
    .data(distanceFromSun)
    .enter()
    .append("text")
    .text(function (d, i) {
        return planetNames[i];
    })
    .attr("y", function (d, i) { // keep the names on different heights, as to not have them overlap. 
        if (i === 2) {
            return 120;
        } else if (i === 0) {
            return 100;
        } else {
            return 150
        };
    })
    .attr("x", function (d, i) {
        return xScale(d) - 25; // names on the x axis, same as the planet position but with a little margin.
    })
    .attr("fill", "white")
    .attr("font-family", "'Space Mono'");




const planetShapes = svg.selectAll("circle")
    .data(distanceFromSun)
    .enter()
    .append("circle") // apply the circles to the svg. 
    .classed("planet", true)
    .attr("r", function (d, i) {
        return sizeScale(size[i]);
    })
    .attr("cx", function (d, i) {
        return xScale(d);
    })

    .attr("cy", innerHeight / 2)


    .attr("fill", function (d, i) {
        return colors[i];
    })
    .on("mouseover", function (d, i) { // mouseover animation


        d3.select(this)
            .style("stroke-width", "5px")
            .transition()
            .duration(200)
            .style("stroke", "white");

    })
    .on("mouseout", function (d, i) { // mouseout
        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "none")
    });

const lines = svg.selectAll("line") // apply lines from the planets toward the names
    .data(distanceFromSun)
    .enter()
    .append("line")
    .style("stroke", "lightgreen")
    .style("stroke-width", 1)
    .attr("x1", function (d, i) {
        return xScale(d);
    })
    .attr("y1", function (d, i) { // placement of the green lines
        if (i === 0) {
            return 110;
        } else if (i === 2) {
            return 130;
        } else {
            return 160;
        }
    })
    .attr("x2", function (d, i) {
        return xScale(d);
    })
    //.attr("y2", (innerHeight / 2))
    .attr("y2", function (d, i) {
        return (innerHeight / 2) - (sizeScale(size[i]) + 10);
    });


const sun = svg.append("circle")
    .attr("cx", -1000)
    .attr("cy", innerHeight / 2)
    .attr("r", 1050)
    .attr("fill", "#ffb137");


const planets = document.querySelectorAll(".planet");
const box = document.querySelector("#box");
let overlay = document.querySelector("#planetOverlay");
const svg_container = document.querySelector('.svg-container');


//Info categories
const overlay_elem = {
    planetName: document.querySelector("#planetName"),
    distanceFromSun: document.querySelector("#distanceFromSun"),
    radius: document.querySelector("#radius"),
    moons: document.querySelector("#moons"),
    orbitalPeriod: document.querySelector("#orbitalPeriod")
}


const clickEvents = {
    clickOutside: (e) => {
        if (e.target == overlay || e.target == document.querySelector('#closeBtn')) {
            clickEvents.closeOverlay();
        }
    },

    closeOverlay: () => {
        overlay.style.display = "none";
        svg_container.style.filter = 'blur(0px)';
        document.removeEventListener('click', clickEvents.clickOutside);
    },

    openOverlay: () => {
        overlay.style.display = "block";
        svg_container.style.filter = 'blur(3px)';

        document.addEventListener('click', clickEvents.clickOutside);
    }
}


planets.forEach((planet, i) => {
    planets[i].addEventListener('click', () => {

        clickEvents.openOverlay();

        overlay_elem.planetName.innerHTML = planetData[i].planetName;
        overlay_elem.distanceFromSun.innerHTML = planetData[i].distanceFromSun;
        overlay_elem.radius.innerHTML = planetData[i].radius;
        overlay_elem.moons.innerHTML = planetData[i].moons;
        overlay_elem.orbitalPeriod.innerHTML = planetData[i].orbitalPeriod;
    })
});


