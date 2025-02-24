import * as PIXI from 'pixi.js';

class LilyPad {
    constructor(x, y, size, bankThickness) {
        // Initialize PIXI objects first
        this.container = new PIXI.Container();
        this.graphics = new PIXI.Graphics();
        this.shadow = new PIXI.Graphics();

        // Set properties
        this.x = x;
        this.y = y;
        this.container.zIndex = 1;
        this.size = size;
        this.bankThickness = bankThickness;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.hasFlower = Math.random() < 0.3;

        // Add graphics objects to the container
        this.container.addChild(this.shadow);
        this.container.addChild(this.graphics);

        // Set initial container position
        this.container.x = this.x;
        this.container.y = this.y;

        // Draw the lily pad
        this.draw();
    }

    draw() {
        this.shadow.clear();
        this.graphics.clear();

        // Draw shadow (offset but won't rotate)
        this.shadow.beginFill(0x000000, 0.2);
        this.shadow.arc(0, 0, this.size, 0.2, 2 * Math.PI - 0.2);
        this.shadow.lineTo(0, 0);
        this.shadow.closePath();
        this.shadow.endFill();

        // Position the shadow with offset
        this.shadow.x = 15;
        this.shadow.y = 15;

        // Draw lily pad at origin
        this.graphics.beginFill(0x355E3B);
        this.graphics.arc(0, 0, this.size, 0.2, 2 * Math.PI - 0.2);
        this.graphics.lineTo(0, 0);
        this.graphics.closePath();

        // Add some detail lines
        this.graphics.lineStyle(2, 0x2D5A27);
        for (let i = 0; i < 3; i++) {
            this.graphics.arc(0, 0, this.size * (0.3 + i * 0.2), 0.2, 2 * Math.PI - 0.2);
        }

        this.graphics.endFill();

        // Draw flower if it has one
        // Draw flower if it has one
        if (this.hasFlower) {
            // Draw multiple layers of petals
            const petalColors = [
                0x9F2B68,
                0xDE3163,
                0xF88379,
                0xF2D2BD
            ];

            const petalCount = 8; // Number of petals per layer
            const layers = 3;     // Number of layers

            for (let layer = 0; layer < layers; layer++) {
                const petalSize = this.size * (0.5 - layer * 0.1); // Larger petals that decrease in size for inner layers
                const offset = (layer * Math.PI) / petalCount; // Rotate each layer slightly

                this.graphics.beginFill(petalColors[layer]);
                this.graphics.lineStyle(1, 0xFF69B4, 0.3); // Add a subtle outline to petals

                // Draw petals in a circle
                for (let i = 0; i < petalCount; i++) {
                    const angle = (i * 2 * Math.PI) / petalCount + offset;
                    // Increase the multiplier from 0.2 to 1.0 to make petals extend further
                    const x = Math.cos(angle) * petalSize;
                    const y = Math.sin(angle) * petalSize;

                    // Draw a petal shape with larger proportions
                    this.graphics.moveTo(0, 0);
                    this.graphics.quadraticCurveTo(
                        x - y * 0.5, y + x * 0.5,
                        x * 1.2, y * 1.2  // Extend the petal tip further
                    );
                    this.graphics.quadraticCurveTo(
                        x + y * 0.5, y - x * 0.5,
                        0, 0
                    );
                }

                this.graphics.endFill();
            }

            // Make the center slightly smaller relative to the larger petals
            this.graphics.beginFill(0xFFF5EE);
            this.graphics.drawCircle(0, 0, this.size * 0.08);
            this.graphics.endFill();
        }
    }

    checkCollision(otherPad) {
        const dx = this.x - otherPad.x;
        const dy = this.y - otherPad.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = this.size + otherPad.size;

        if (distance < minDistance) {
            // Calculate unit normal vector
            const nx = dx / distance;
            const ny = dy / distance;

            // Calculate relative velocity
            const dvx = this.vx - otherPad.vx;
            const dvy = this.vy - otherPad.vy;

            // Calculate impulse with no energy loss (bounce factor = 1.0)
            const impulse = -(dvx * nx + dvy * ny);

            // Apply impulse to both pads
            this.vx += impulse * nx;
            this.vy += impulse * ny;
            otherPad.vx -= impulse * nx;
            otherPad.vy -= impulse * ny;

            // Separate the pads to prevent sticking
            const overlap = minDistance - distance;
            const separationX = overlap * nx * 0.5;
            const separationY = overlap * ny * 0.5;

            this.x += separationX;
            this.y += separationY;
            otherPad.x -= separationX;
            otherPad.y -= separationY;
        }
    }

    update(app, lilyPads) {
        // Move lily pad
        this.x += this.vx;
        this.y += this.vy;

        // Rotate only the lily pad, not the shadow
        this.graphics.rotation = this.rotation;
        this.shadow.rotation = this.rotation;
        this.rotation += this.rotationSpeed;

        // Check collisions with other lily pads
        lilyPads.forEach(pad => {
            if (pad !== this) {
                this.checkCollision(pad);
            }
        });

        // Bounce off edges with no energy loss
        if (this.x < this.bankThickness + this.size ||
            this.x > app.screen.width - this.bankThickness - this.size) {
            this.vx *= -1;
        }
        if (this.y < this.bankThickness + this.size ||
            this.y > app.screen.height - this.bankThickness - this.size) {
            this.vy *= -1;
        }

        // Keep within bounds
        this.x = Math.max(this.bankThickness + this.size,
            Math.min(this.x, app.screen.width - this.bankThickness - this.size));
        this.y = Math.max(this.bankThickness + this.size,
            Math.min(this.y, app.screen.height - this.bankThickness - this.size));

        // Update container position instead of individual graphics
        this.container.x = this.x;
        this.container.y = this.y;
    }

    addToStage(stage) {
        stage.addChild(this.container); // Add the container instead of just the graphics
    }
}

export default LilyPad;