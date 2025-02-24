let mouseX = 0;
let mouseY = 0;

const handleAnimation = (app, circles, fishes, lilyPads, foods, cohesionFactor, alignmentFactor, separationFactor) => {
    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    window.addEventListener('touchmove', (event) => {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    });

    app.ticker.add(() => {
        circles.forEach(circle => circle.update(circles, cohesionFactor, alignmentFactor, separationFactor, mouseX, mouseY));
        fishes.forEach(fish => fish.update(foods));
        lilyPads.forEach(lilyPad => lilyPad.update(app, lilyPads));
        for (let i = foods.length - 1; i >= 0; i--) {
            if (!foods[i].update()) {
                foods[i].destroy(); // Ensure the food is properly destroyed
                foods.splice(i, 1); // Remove the food from the array if it has expired
            }
        }
    });
};

export { handleAnimation };