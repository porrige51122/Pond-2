import * as PIXI from 'pixi.js';

class Circle {
    constructor(radius, color, bankThickness) {
        this.radius = radius;
        this.color = color;
        this.bankThickness = bankThickness;
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
        this.graphics.x = Math.random() * (window.innerWidth - this.radius * 2 - this.bankThickness * 2) + this.radius + this.bankThickness;
        this.graphics.y = Math.random() * (window.innerHeight - this.radius * 2 - this.bankThickness * 2) + this.radius + this.bankThickness;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;

        // Create trailing circles
        this.trail1 = new PIXI.Graphics();
        this.trail1.beginFill(this.color, 0.5);
        this.trail1.drawCircle(0, 0, this.radius * 0.75);
        this.trail1.endFill();
        this.trail1.x = this.graphics.x;
        this.trail1.y = this.graphics.y;

        this.trail2 = new PIXI.Graphics();
        this.trail2.beginFill(this.color, 0.25);
        this.trail2.drawCircle(0, 0, this.radius * 0.5);
        this.trail2.endFill();
        this.trail2.x = this.graphics.x;
        this.trail2.y = this.graphics.y;
    }

    addToStage(stage) {
        stage.addChild(this.trail2);
        stage.addChild(this.trail1);
        stage.addChild(this.graphics);
    }

    update(circles, cohesionFactor, alignmentFactor, separationFactor, mouseX, mouseY) {
        this.applyBoidsRules(circles, cohesionFactor, alignmentFactor, separationFactor);

        // Add some randomness to the movement
        this.vx += (Math.random() - 0.5) * 0.1;
        this.vy += (Math.random() - 0.5) * 0.1;

        // Move away from the mouse cursor if close enough
        const dx = this.graphics.x - mouseX;
        const dy = this.graphics.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseRepelDistance = 100;
        if (distance < mouseRepelDistance) {
            const repelFactor = 0.1;
            this.vx += (dx / distance) * repelFactor;
            this.vy += (dy / distance) * repelFactor;
        }

        // Update trailing circles positions with a closer delay
        this.trail2.x += (this.trail1.x - this.trail2.x) * 0.5;
        this.trail2.y += (this.trail1.y - this.trail2.y) * 0.5;

        this.trail1.x += (this.graphics.x - this.trail1.x) * 0.5;
        this.trail1.y += (this.graphics.y - this.trail1.y) * 0.5;

        // Update main circle position
        this.graphics.x += this.vx;
        this.graphics.y += this.vy;

        if (this.graphics.x - this.radius <= this.bankThickness || this.graphics.x + this.radius >= window.innerWidth - this.bankThickness) {
            this.vx *= -1;
        }

        if (this.graphics.y - this.radius <= this.bankThickness || this.graphics.y + this.radius >= window.innerHeight - this.bankThickness) {
            this.vy *= -1;
        }

        // Limit speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 2;
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }

    applyBoidsRules(circles, cohesionFactor, alignmentFactor, separationFactor) {
        let separation = { x: 0, y: 0 };
        let alignment = { x: 0, y: 0 };
        let cohesion = { x: 0, y: 0 };
        let count = 0;

        circles.forEach(circle => {
            if (circle !== this) {
                const dx = this.graphics.x - circle.graphics.x;
                const dy = this.graphics.y - circle.graphics.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 50) { // Increased separation distance
                    // Separation
                    separation.x += dx / distance;
                    separation.y += dy / distance;

                    // Alignment
                    alignment.x += circle.vx;
                    alignment.y += circle.vy;

                    // Cohesion
                    cohesion.x += circle.graphics.x;
                    cohesion.y += circle.graphics.y;

                    count++;
                }
            }
        });

        if (count > 0) {
            // Average the values
            separation.x /= count;
            separation.y /= count;
            alignment.x /= count;
            alignment.y /= count;
            cohesion.x /= count;
            cohesion.y /= count;

            // Cohesion: steer towards the average position of local flockmates
            cohesion.x = (cohesion.x - this.graphics.x) * cohesionFactor;
            cohesion.y = (cohesion.y - this.graphics.y) * cohesionFactor;

            // Alignment: steer towards the average heading of local flockmates
            alignment.x = (alignment.x - this.vx) * alignmentFactor;
            alignment.y = (alignment.y - this.vy) * alignmentFactor;

            // Separation: steer to avoid crowding local flockmates
            separation.x *= separationFactor;
            separation.y *= separationFactor;

            // Apply the forces
            this.vx += separation.x + alignment.x + cohesion.x;
            this.vy += separation.y + alignment.y + cohesion.y;

            // Add a small random force to allow circles to split off
            this.vx += (Math.random() - 0.5) * 0.05;
            this.vy += (Math.random() - 0.5) * 0.05;
        }
    }
}

export default Circle;