import * as PIXI from 'pixi.js';
import Circle from './objects/Circle';
import Fish from './objects/Fish';
import Food from './objects/Food';
import Rock from './objects/Rock';

// Create the application
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x5B85AA // New background color
});

// Add the application view to the HTML document
document.body.appendChild(app.view);

// Create a bank around the pond with an irregular shape
const bankThickness = 100;
const bank = new PIXI.Graphics();
bank.beginFill(0x345511); // Brown color for the bank
bank.drawRect(0, 0, app.screen.width, app.screen.height); // Outer bank
bank.zIndex = 10;
bank.beginHole();

var variation = 100;
var cornerBuffer = 50;

// Fixed values for cohesion, alignment, and separation
const cohesionFactor = 0.002;
const alignmentFactor = 0.006;
const separationFactor = 0.07;

// Generate points for each edge
const generateEdgePoints = (start, end, minCount, maxCount, variation) => {
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const points = [];
    for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x = start.x + t * (end.x - start.x);
        const y = start.y + t * (end.y - start.y);
        points.push({ x: x + Math.random() * variation - variation / 2, y: y + Math.random() * variation - variation / 2 });
    }
    return points;
};

const topEdgePoints = generateEdgePoints({ x: bankThickness + cornerBuffer, y: bankThickness }, { x: app.screen.width - bankThickness - cornerBuffer, y: bankThickness }, 8, 12, variation);
const rightEdgePoints = generateEdgePoints({ x: app.screen.width - bankThickness, y: bankThickness + cornerBuffer }, { x: app.screen.width, y: app.screen.height - bankThickness - cornerBuffer }, 8, 12, variation);
const bottomEdgePoints = generateEdgePoints({ x: app.screen.width - bankThickness - cornerBuffer, y: app.screen.height - bankThickness }, { x: bankThickness + cornerBuffer, y: app.screen.height - bankThickness }, 8, 12, variation);
const leftEdgePoints = generateEdgePoints({ x: bankThickness, y: app.screen.height - bankThickness - cornerBuffer }, { x: bankThickness, y: bankThickness + cornerBuffer }, 8, 12, variation);

// Remove points that are too close to the corners
const removeCloseToCorners = (points, threshold) => {
    return points.filter(point => {
        const isCloseToTopLeft = point.x < bankThickness + threshold && point.y < bankThickness + threshold;
        const isCloseToTopRight = point.x > app.screen.width - bankThickness - threshold && point.y < bankThickness + threshold;
        const isCloseToBottomRight = point.x > app.screen.width - bankThickness - threshold && point.y > app.screen.height - bankThickness - threshold;
        const isCloseToBottomLeft = point.x < bankThickness + threshold && point.y > app.screen.height - bankThickness - threshold;
        return !(isCloseToTopLeft || isCloseToTopRight || isCloseToBottomRight || isCloseToBottomLeft);
    });
};

const threshold = 20;
const allEdgePoints = [
    ...removeCloseToCorners(topEdgePoints, threshold),
    ...removeCloseToCorners(rightEdgePoints, threshold),
    ...removeCloseToCorners(bottomEdgePoints, threshold),
    ...removeCloseToCorners(leftEdgePoints, threshold)
];

// Draw the edges with bezier curves
const drawEdges = (points) => {
    for (let i = 0; i < points.length; i++) {
        const nextIndex = (i + 1) % points.length;
        const midX = (points[i].x + points[nextIndex].x) / 2;
        const midY = (points[i].y + points[nextIndex].y) / 2;
        bank.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
};

// Create an array to hold the circles
const circles = [];

// Create circles
for (let i = 0; i < 500; i++) {
    const circle = new Circle(2, 0x000000, bankThickness);
    circle.graphics.zIndex = 1;
    circle.addToStage(app.stage);
    circles.push(circle);
}

// Create an array to hold the fish
const fishes = [];

// Create fish with varying sizes
for (let i = 0; i < 20; i++) {
    const fish = new Fish(3, 7, 0xd1b490, bankThickness); // Fish with varying sizes between 3 and 7
    fish.graphics.zIndex = 1;
    fish.addToStage(app.stage);
    fishes.push(fish);
}

const firstPoint = allEdgePoints[0];
const firstMidx = (firstPoint.x + allEdgePoints[1].x) / 2;
const firstMidy = (firstPoint.y + allEdgePoints[1].y) / 2;
bank.moveTo(firstMidx, firstMidy);
// Pop first point
allEdgePoints.shift();
allEdgePoints.push(firstPoint);
// Draw the bank 
drawEdges(allEdgePoints);
bank.closePath();
bank.endHole();
bank.endFill();
bank.zIndex = 2;
app.stage.addChild(bank);

// Create the pond with an irregular shape
const pond = new PIXI.Graphics();
pond.beginFill(0x5B85AA); // Blue color for the pond
pond.moveTo(bankThickness, bankThickness);

// Draw the pond edges
drawEdges(allEdgePoints);

pond.closePath();
pond.endFill();
pond.zIndex = 0;
app.stage.addChild(pond);

// Add rocks on the edge of the bank
const rocks = [];
const minRockSize = 8;
const maxRockSize = 15;

const addRocks = (points) => {
    for (let i = 0; i < points.length - 1; i++) {
        const rockSize = Math.random() * (maxRockSize - minRockSize) + minRockSize;
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        const rock = new Rock(midX, midY, rockSize);
        rock.graphics.zIndex = 3;
        rocks.push(rock);
    }
};

addRocks(topEdgePoints);
addRocks(rightEdgePoints);
addRocks(bottomEdgePoints);
addRocks(leftEdgePoints);

// Create an array to hold the food
const foods = [];

// Track mouse position and handle left-click to drop food
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener('click', (event) => {
    const food = new Food(event.clientX, event.clientY);
    food.graphics.zIndex = 1;
    food.addToStage(app.stage);
    foods.push(food);
});

// Add rocks to the stage after fish and circles
rocks.forEach(rock => rock.addToStage(app.stage));

// Enable zIndex sorting
app.stage.sortableChildren = true;

// Animation loop
app.ticker.add(() => {
    circles.forEach(circle => circle.update(circles, cohesionFactor, alignmentFactor, separationFactor, mouseX, mouseY));
    fishes.forEach(fish => fish.update(foods));
    for (let i = foods.length - 1; i >= 0; i--) {
        if (!foods[i].update()) {
            foods[i].destroy(); // Ensure the food is properly destroyed
            foods.splice(i, 1); // Remove the food from the array if it has expired
        }
    }
});