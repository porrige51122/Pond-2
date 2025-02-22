import * as PIXI from 'pixi.js';

class Fish {
    constructor(minRadius, maxRadius, color, bankThickness) {
        this.radius = Math.random() * (maxRadius - minRadius) + minRadius;
        this.color = color;
        this.bankThickness = bankThickness;
        this.graphics = new PIXI.Container();

        // Create the body of the fish
        this.body = new PIXI.Graphics();
        this.body.beginFill(this.color);
        this.body.drawEllipse(0, 0, this.radius * 2, this.radius); // Draw an ellipse to represent the fish body
        this.body.endFill();
        this.graphics.addChild(this.body);

        // Create the tail of the fish
        this.tail = new PIXI.Graphics();
        this.tail.beginFill(this.color);
        this.tail.drawPolygon([
            0, 0,
            -this.radius * 2, -this.radius * 0.5,
            -this.radius * 2, this.radius * 0.5
        ]); // Draw a stretched triangle to represent the fish tail
        this.tail.endFill();
        this.tail.x = -this.radius * 2;
        this.graphics.addChild(this.tail);

        this.graphics.x = Math.random() * (window.innerWidth - this.radius * 4 - this.bankThickness * 2) + this.radius * 2 + this.bankThickness;
        this.graphics.y = Math.random() * (window.innerHeight - this.radius * 2 - this.bankThickness * 2) + this.radius + this.bankThickness;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.wiggleSpeed = 0;
        this.wiggleAngle = 0;
        this.targetFood = null;
        this.destroyed = false; // Flag to indicate if the fish has been destroyed
    }

    addToStage(stage) {
        stage.addChild(this.graphics);
    }

    destroy() {
        this.graphics.destroy();
        this.destroyed = true;
    }

    grow(amount = 0.5) {
        this.radius += amount; // Increase the size of the fish
        this.body.clear();
        this.body.beginFill(this.color);
        this.body.drawEllipse(0, 0, this.radius * 2, this.radius);
        this.body.endFill();

        this.tail.clear();
        this.tail.beginFill(this.color);
        this.tail.drawPolygon([
            0, 0,
            -this.radius * 2, -this.radius * 0.5,
            -this.radius * 2, this.radius * 0.5
        ]);
        this.tail.endFill();
        this.tail.x = -this.radius * 2;
    }

    update(foods) {
        if (this.destroyed || !this.graphics.transform) {
            return; // Ensure the graphics object is valid and not destroyed
        }

        // Check if the fish is near any food
        if (!this.targetFood) {
            for (let i = 0; i < foods.length; i++) {
                const food = foods[i];
                if (food.destroyed) {
                    continue; // Skip destroyed food
                }
                const dx = this.graphics.x - food.graphics.x;
                const dy = this.graphics.y - food.graphics.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) { // If the fish is within 100 pixels of the food
                    this.targetFood = food;
                    break;
                }
            }
        }

        if (this.targetFood) {
            if (this.targetFood.destroyed) {
                this.targetFood = null; // Clear the target food if it has been destroyed
            } else {
                const dx = this.targetFood.graphics.x - this.graphics.x;
                const dy = this.targetFood.graphics.y - this.graphics.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 5) { // If the fish is close enough to the food
                    if (!this.targetFood.reduceSize()) { // Reduce the size of the food
                        this.targetFood = null; // Clear the target food if it has been consumed
                    }
                    this.grow(0.02); // Increase the size of the fish
                } else {
                    // Move towards the food
                    const angle = Math.atan2(dy, dx);
                    this.vx = Math.cos(angle);
                    this.vy = Math.sin(angle);
                }
            }
        } else {
            // Add some randomness to the movement
            this.vx += (Math.random() - 0.5) * 0.05;
            this.vy += (Math.random() - 0.5) * 0.05;
        }

        // Calculate the speed of the fish
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        // Smooth the motion by easing the velocity
        const easing = 0.05;
        this.vx += (Math.random() - 0.5) * easing;
        this.vy += (Math.random() - 0.5) * easing;

        // Ensure the fish doesn't go on the edge when turning
        const edgeBuffer = this.radius * 4;
        if (this.graphics.x - edgeBuffer <= this.bankThickness) {
            this.vx += 0.1; // Gradually turn away from the left edge
        } else if (this.graphics.x + edgeBuffer >= window.innerWidth - this.bankThickness) {
            this.vx -= 0.1; // Gradually turn away from the right edge
        }

        if (this.graphics.y - edgeBuffer <= this.bankThickness) {
            this.vy += 0.1; // Gradually turn away from the top edge
        } else if (this.graphics.y + edgeBuffer >= window.innerHeight - this.bankThickness) {
            this.vy -= 0.1; // Gradually turn away from the bottom edge
        }

        // Update fish position
        this.graphics.x += this.vx;
        this.graphics.y += this.vy;

        // Rotate the fish to face the direction of movement
        this.graphics.rotation = Math.atan2(this.vy, this.vx);

        // Wiggle the tail based on the speed of the fish
        this.wiggleSpeed = speed * 0.1;
        this.wiggleAngle += this.wiggleSpeed;
        this.tail.rotation = Math.sin(this.wiggleAngle) * 0.5;

        // Limit speed
        const maxSpeed = 2;
        const minSpeed = 0.5;
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        } else if (speed < minSpeed) {
            this.vx = (this.vx / speed) * minSpeed;
            this.vy = (this.vy / speed) * minSpeed;
        }
    }
}

export default Fish;