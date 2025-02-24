import * as PIXI from 'pixi.js';

class Rock {
    constructor(x, y, size) {
        this.graphics = new PIXI.Graphics();
        this.size = size;

        // Random rock properties
        this.rockType = Math.floor(Math.random() * 4); // 0-3 different types
        this.baseColor = this.getRandomRockColor();
        this.points = this.generateWigglyShape();

        // Draw the rock with patterns
        this.drawRockWithPattern();

        this.graphics.x = x;
        this.graphics.y = y;
    }

    getRandomRockColor() {
        const colors = [
            0x808080, // Gray
            0x8B4513, // Saddle Brown
            0xA0522D, // Sienna
            0x6B4423, // Dark Brown
            0x696969, // Dim Gray
            0x7B7B7B  // Light Gray
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateWigglyShape() {
        const points = [];
        // Vary the number of points for different shapes
        const numPoints = 8 + Math.floor(Math.random() * 6); // 8-13 points
        const angleStep = (Math.PI * 2) / numPoints;

        // Different shape variations
        const shapeVariation = Math.random();

        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            let radius;

            if (shapeVariation < 0.3) {
                // More angular rocks
                radius = 0.7 + Math.random() * 0.6;
            } else if (shapeVariation < 0.6) {
                // Smoother rocks
                radius = 0.85 + Math.random() * 0.3;
            } else {
                // Very irregular rocks
                radius = 0.5 + Math.random() * 1;
            }

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            points.push({ x, y });
        }
        return points;
    }

    drawRockWithPattern() {
        const scaledPoints = this.points.map(point => ({
            x: point.x * this.size,
            y: point.y * this.size
        }));

        // Draw base rock
        this.graphics.beginFill(this.baseColor);
        const flatPoints = scaledPoints.flatMap(point => [point.x, point.y]);
        this.graphics.drawPolygon(flatPoints);
        this.graphics.endFill();

        // Add patterns based on rock type
        switch (this.rockType) {
            case 0: // Striped pattern
                this.addStripes(scaledPoints);
                break;
            case 1: // Spotted pattern
                this.addSpots();
                break;
            case 2: // Cracked pattern
                this.addCracks();
                break;
            case 3: // Textured pattern
                this.addTexture();
                break;
        }
    }

    addStripes(points) {
        const darker = this.adjustColor(this.baseColor, -30);
        this.graphics.lineStyle(1, darker, 0.3);

        for (let i = -this.size; i <= this.size; i += 3) {
            this.graphics.moveTo(-this.size, i);
            this.graphics.lineTo(this.size, i + this.size * 0.5);
        }
    }

    addSpots() {
        const lighter = this.adjustColor(this.baseColor, 20);
        this.graphics.beginFill(lighter, 0.3);

        for (let i = 0; i < 10; i++) {
            const x = (Math.random() - 0.5) * this.size;
            const y = (Math.random() - 0.5) * this.size;
            const radius = Math.random() * (this.size * 0.2);
            this.graphics.drawCircle(x, y, radius);
        }
        this.graphics.endFill();
    }

    addCracks() {
        const darker = this.adjustColor(this.baseColor, -40);
        this.graphics.lineStyle(1, darker, 0.5);

        for (let i = 0; i < 5; i++) {
            const startX = (Math.random() - 0.5) * this.size;
            const startY = (Math.random() - 0.5) * this.size;
            this.graphics.moveTo(startX, startY);

            let x = startX;
            let y = startY;
            const points = 3 + Math.floor(Math.random() * 3);

            for (let j = 0; j < points; j++) {
                x += (Math.random() - 0.5) * this.size * 0.5;
                y += (Math.random() - 0.5) * this.size * 0.5;
                this.graphics.lineTo(x, y);
            }
        }
    }

    addTexture() {
        const darker = this.adjustColor(this.baseColor, -20);
        this.graphics.lineStyle(0.5, darker, 0.2);

        for (let i = 0; i < 30; i++) {
            const x = (Math.random() - 0.5) * this.size * 2;
            const y = (Math.random() - 0.5) * this.size * 2;
            const length = Math.random() * this.size * 0.3;
            const angle = Math.random() * Math.PI * 2;

            this.graphics.moveTo(x, y);
            this.graphics.lineTo(
                x + Math.cos(angle) * length,
                y + Math.sin(angle) * length
            );
        }
    }

    adjustColor(color, amount) {
        const r = Math.min(255, Math.max(0, ((color >> 16) & 0xFF) + amount));
        const g = Math.min(255, Math.max(0, ((color >> 8) & 0xFF) + amount));
        const b = Math.min(255, Math.max(0, (color & 0xFF) + amount));
        return (r << 16) | (g << 8) | b;
    }

    addToStage(stage) {
        stage.addChild(this.graphics);
    }
}

export default Rock;