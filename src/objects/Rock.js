import * as PIXI from 'pixi.js';

class Rock {
    constructor(x, y, size) {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0x8B4513); // Brown color for the rock
        this.size = size;
        this.points = this.generateWigglyShape(); // Generate the initial wiggly shape points
        this.drawWigglyShape(); // Draw the wiggly shape
        this.graphics.endFill();
        this.graphics.x = x;
        this.graphics.y = y;
    }

    addToStage(stage) {
        stage.addChild(this.graphics);
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
}

export default Rock;