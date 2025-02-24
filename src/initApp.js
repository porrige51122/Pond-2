import * as PIXI from 'pixi.js';

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// Define constants
const bankThickness = Math.min(vw, vh) * 0.05;
const cohesionFactor = 0.002;
const alignmentFactor = 0.006;
const separationFactor = 0.07;


const app = new PIXI.Application({
    width: vw,
    height: vh,
    backgroundColor: 0x5B85AA,
    antialias: true
});

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(app.view);
});

// Handle window resize
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

// Add the application view to the HTML document
document.body.appendChild(app.view);


export { app, bankThickness, cohesionFactor, alignmentFactor, separationFactor, vw, vh };