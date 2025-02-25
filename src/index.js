import { app, bankThickness, cohesionFactor, alignmentFactor, separationFactor, vw, vh } from './initApp';
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

// Add rocks on the edge of the bank
const rocks = addRocks(app, allEdgePoints);

// Create an array to hold the circles
const circles = [];

// Create circles (tadpoles)
const numberOfCircles = Math.floor(Math.min(vw, vh) * 0.5); // Number relative to screen size
const circleSize = Math.min(vw, vh) * 0.003; // 0.2% of screen

for (let i = 0; i < numberOfCircles; i++) {
    const circle = new Circle(circleSize, 0x000000, bankThickness);
    circle.graphics.zIndex = 1;
    circle.addToStage(app.stage);
    circles.push(circle);
}

// Create an array to hold the fish
const fishes = [];

// Define fish colors (using warm, natural fish colors)
const fishColors = [
    0xd1b490, // Original beige
    0xE7A55D, // Golden orange
    0xC17E3E, // Brown
    0xFFB6B6, // Salmon pink
    0xE6CCB3, // Light beige
    0xB38F6B  // Dark beige
];


// Create fish with varying sizes
const minFishSize = Math.min(vw, vh) * 0.005; // 0.5% of screen
const maxFishSize = Math.min(vw, vh) * 0.012; // 1.2% of screen
const numberOfFish = Math.floor(Math.min(vw, vh) * 0.02); // Number of fish relative to screen size

for (let i = 0; i < numberOfFish; i++) {
    const randomColor = fishColors[Math.floor(Math.random() * fishColors.length)];
    const fish = new Fish(minFishSize, maxFishSize, randomColor, bankThickness);
    fish.graphics.zIndex = 1;
    fish.addToStage(app.stage);
    fishes.push(fish);
}

// Create an array to hold the lily pads
const lilyPads = [];

// Create lily pads
for (let i = 0; i < Math.floor(Math.min(vw, vh) * 0.01); i++) { // Number of pads relative to screen size
    const x = bankThickness + Math.random() * (app.screen.width - 2 * bankThickness);
    const y = bankThickness + Math.random() * (app.screen.height - 2 * bankThickness);
    // Size relative to screen dimension (between 2% and 4% of smallest screen dimension)
    const minSize = Math.min(vw, vh) * 0.05;
    const maxSize = Math.min(vw, vh) * 0.10;
    const size = Math.random() * (maxSize - minSize) + minSize;
    const lilyPad = new LilyPad(x, y, size, bankThickness);
    lilyPad.graphics.zIndex = 2;
    lilyPad.addToStage(app.stage);
    lilyPads.push(lilyPad);
}

// Create an array to hold the food
const foods = [];
// Track whether we're currently dragging
let isDragging = false;
let foodPlaced = false;

// Add touch and mouse event handlers for food dropping and fish scaring
const handleStart = (event) => {
    isDragging = true;
    foodPlaced = false;
    handleMove(event);
};

const handleMove = (event) => {
    if (!isDragging) return;

    // Get coordinates from either mouse or touch
    const x = event.clientX || event.touches[0].clientX;
    const y = event.clientY || event.touches[0].clientY;
    if (!foodPlaced) {
        const food = new Food(x, y);
        food.graphics.zIndex = 1;
        food.addToStage(app.stage);
        foods.push(food);
        foodPlaced = true;
    }

    // Prevent default behavior to avoid scrolling/zooming
    event.preventDefault();
};

const handleEnd = () => {
    isDragging = false;
    foodPlaced = false;
};

// Add both mouse and touch event listeners
window.addEventListener('mousedown', handleStart);
window.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleEnd);
window.addEventListener('mouseleave', handleEnd);

window.addEventListener('touchstart', handleStart);
window.addEventListener('touchmove', handleMove);
window.addEventListener('touchend', handleEnd);
window.addEventListener('touchcancel', handleEnd);

// Prevent default touch behavior to avoid scrolling/zooming
window.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

// Add rocks to the stage after fish and circles
rocks.forEach(rock => rock.addToStage(app.stage));

// Enable zIndex sorting
app.stage.sortableChildren = true;

// Handle the animation loop
handleAnimation(app, circles, fishes, lilyPads, foods, cohesionFactor, alignmentFactor, separationFactor);