import * as PIXI from 'pixi.js';

// Create the application
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x5B85AA // New background color
});

// Add the application view to the HTML document
document.body.appendChild(app.view);

// Define constants
const bankThickness = 100;
const cohesionFactor = 0.002;
const alignmentFactor = 0.006;
const separationFactor = 0.07;

export { app, bankThickness, cohesionFactor, alignmentFactor, separationFactor };