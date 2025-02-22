import * as PIXI from 'pixi.js';

class Food {
    constructor(x, y) {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xffd700); // Yellow color for the food
        this.size = 8; // Initial size of the food
        this.points = this.generateWigglyShape(); // Generate the initial wiggly shape points
        this.drawWigglyShape(); // Draw the wiggly shape
        this.graphics.endFill();
        this.graphics.x = x;
        this.graphics.y = y;
        this.lifetime = 15000; // Lifetime of the food in milliseconds (15 seconds)
        this.creationTime = Date.now();
        this.destroyed = false; // Flag to indicate if the food has been destroyed
    }

    addToStage(stage) {
        stage.addChild(this.graphics);
    }

    destroy() {
        if (!this.destroyed) {
            this.graphics.destroy(); // Remove the food from the stage
            this.destroyed = true;
        }
    }

    reduceSize() {
        this.size -= 0.1; // Reduce the size of the food
        if (this.size <= 0) {
            this.destroy(); // Remove the food from the stage if size is zero or less
            return false; // Indicate that the food should be removed from the array
        } else {
            this.graphics.clear();
            this.graphics.beginFill(0xffd700);
            this.drawWigglyShape(); // Redraw the wiggly shape with the new size
            this.graphics.endFill();
            return true; // Indicate that the food is still active
        }
    }

    generateWigglyShape() {
        const points = [];
        const numPoints = 10;
        const angleStep = (Math.PI * 2) / numPoints;
        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            const radius = 1 + Math.random() * 0.5; // Use a base radius of 1 for consistency
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            points.push({ x, y });
        }
        return points;
    }

    drawWigglyShape() {
        const scaledPoints = this.points.map(point => ({
            x: point.x * this.size,
            y: point.y * this.size
        }));
        const flatPoints = scaledPoints.flatMap(point => [point.x, point.y]);
        this.graphics.drawPolygon(flatPoints);
    }

    update() {
        const currentTime = Date.now();
        if (currentTime - this.creationTime > this.lifetime) {
            this.destroy(); // Remove the food from the stage after its lifetime
            return false; // Indicate that the food should be removed from the array
        }
        if (this.size <= 0) {
            return false; // Indicate that the food should be removed from the array
        }
        return true; // Indicate that the food is still active
    }
}

export default Food;