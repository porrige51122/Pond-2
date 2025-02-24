import { app, bankThickness, cohesionFactor, alignmentFactor, separationFactor } from './initApp';
import { createBank } from './createBank';
import { createPond } from './createPond';
import { addRocks } from './addRocks';
import { handleAnimation } from './handleAnimation';
import Circle from './objects/Tadpole';
import Fish from './objects/Fish';
import Food from './objects/Food';
import LilyPad from './objects/LilyPad';

// Create the bank
const { bank, allEdgePoints } = createBank(app, bankThickness);

// Create the pond
createPond(app, bankThickness, allEdgePoints);

// Add rocks on the edge of the bank
const rocks = addRocks(app, allEdgePoints);

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

// Create an array to hold the lily pads
const lilyPads = [];

// Create lily pads
for (let i = 0; i < 10; i++) {
    // Random position within pond bounds
    const x = bankThickness + Math.random() * (app.screen.width - 2 * bankThickness);
    const y = bankThickness + Math.random() * (app.screen.height - 2 * bankThickness);
    // Random size between 30 and 80
    const size = Math.random() * 50 + 30;
    const lilyPad = new LilyPad(x, y, size, bankThickness);
    lilyPad.graphics.zIndex = 2; // Above fish but below rocks
    lilyPad.addToStage(app.stage);
    lilyPads.push(lilyPad);
}

// Create an array to hold the food
const foods = [];

// Track mouse position and handle left-click to drop food
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

// Handle the animation loop
handleAnimation(app, circles, fishes, lilyPads, foods, cohesionFactor, alignmentFactor, separationFactor);