import * as PIXI from 'pixi.js';

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

// Remove points that are too close to the corners
const removeCloseToCorners = (points, threshold, bankThickness, app) => {
    return points.filter(point => {
        const isCloseToTopLeft = point.x < bankThickness + threshold && point.y < bankThickness + threshold;
        const isCloseToTopRight = point.x > app.screen.width - bankThickness - threshold && point.y < bankThickness + threshold;
        const isCloseToBottomRight = point.x > app.screen.width - bankThickness - threshold && point.y > app.screen.height - bankThickness - threshold;
        const isCloseToBottomLeft = point.x < bankThickness + threshold && point.y > app.screen.height - bankThickness - threshold;
        return !(isCloseToTopLeft || isCloseToTopRight || isCloseToBottomRight || isCloseToBottomLeft);
    });
};

// Draw the edges with bezier curves
const drawEdges = (points, bank) => {
    for (let i = 0; i < points.length; i++) {
        const nextIndex = (i + 1) % points.length;
        const midX = (points[i].x + points[nextIndex].x) / 2;
        const midY = (points[i].y + points[nextIndex].y) / 2;
        bank.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
};

// Add the isInsidePond function
const isInsidePond = (x, y, allEdgePoints) => {
    let inside = false;
    for (let i = 0, j = allEdgePoints.length - 1; i < allEdgePoints.length; j = i++) {
        const xi = allEdgePoints[i].x, yi = allEdgePoints[i].y;
        const xj = allEdgePoints[j].x, yj = allEdgePoints[j].y;

        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};


const createBank = (app, bankThickness) => {
    const bank = new PIXI.Graphics();
    bank.beginFill(0x345511); // Brown color for the bank
    bank.drawRect(0, 0, app.screen.width, app.screen.height); // Outer bank
    bank.zIndex = 10;
    bank.beginHole();

    const variation = 100;
    const cornerBuffer = 50;

    const topEdgePoints = generateEdgePoints({ x: bankThickness + cornerBuffer, y: bankThickness }, { x: app.screen.width - bankThickness - cornerBuffer, y: bankThickness }, 8, 12, variation);
    const rightEdgePoints = generateEdgePoints({ x: app.screen.width - bankThickness, y: bankThickness + cornerBuffer }, { x: app.screen.width, y: app.screen.height - bankThickness - cornerBuffer }, 8, 12, variation);
    const bottomEdgePoints = generateEdgePoints({ x: app.screen.width - bankThickness - cornerBuffer, y: app.screen.height - bankThickness }, { x: bankThickness + cornerBuffer, y: app.screen.height - bankThickness }, 8, 12, variation);
    const leftEdgePoints = generateEdgePoints({ x: bankThickness, y: app.screen.height - bankThickness - cornerBuffer }, { x: bankThickness, y: bankThickness + cornerBuffer }, 8, 12, variation);

    const threshold = 20;
    const allEdgePoints = [
        ...removeCloseToCorners(topEdgePoints, threshold, bankThickness, app),
        ...removeCloseToCorners(rightEdgePoints, threshold, bankThickness, app),
        ...removeCloseToCorners(bottomEdgePoints, threshold, bankThickness, app),
        ...removeCloseToCorners(leftEdgePoints, threshold, bankThickness, app)
    ];

    const firstPoint = allEdgePoints[0];
    const firstMidx = (firstPoint.x + allEdgePoints[1].x) / 2;
    const firstMidy = (firstPoint.y + allEdgePoints[1].y) / 2;
    bank.moveTo(firstMidx, firstMidy);
    allEdgePoints.shift();
    allEdgePoints.push(firstPoint);

    drawEdges(allEdgePoints, bank);
    bank.closePath();
    bank.endHole();
    bank.endFill();
    bank.zIndex = 2;
    app.stage.addChild(bank);

    // Create a single graphics object for all grass
    const grassContainer = new PIXI.Graphics();
    grassContainer.zIndex = 11;
    // Density is based on screen size
    const grassDensity = Math.floor(app.screen.width * app.screen.height / 100);

    // Helper function to get random green shade
    const getRandomGreenShade = () => {
        const colors = [
            0x345511, // Base green
            0x4A7A1E, // Lighter green
            0x2D4A0F, // Darker green
            0x5C8A32, // Olive green
            0x3B6619  // Forest green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Draw all grass blades in one go
    for (let i = 0; i < grassDensity; i++) {
        let x = Math.random() * app.screen.width;
        let y = Math.random() * app.screen.height;

        if (!isInsidePond(x, y, allEdgePoints)) {
            const height = 3 + Math.random() * 4;
            const angle = -0.2 + Math.random() * 0.4;

            grassContainer.lineStyle(1, getRandomGreenShade(), 0.8);
            grassContainer.moveTo(x, y);
            grassContainer.quadraticCurveTo(
                x + angle * height * 2,
                y - height / 2,
                x + angle * height * 3,
                y - height
            );
        }
    }

    app.stage.addChild(grassContainer);
    return { bank, allEdgePoints };
};

export { createBank, drawEdges, isInsidePond };