import * as PIXI from 'pixi.js';

// Constants for bank generation
const BANK_CONFIG = {
    // Variation in edge point positions (% of screen width)
    EDGE_VARIATION: 0.1,
    // Buffer from corners (% of screen width)
    CORNER_BUFFER: 0.05,
    // Min and max points per edge
    MIN_EDGE_POINTS: 8,
    MAX_EDGE_POINTS: 12,
    // Distance from corners to remove points (% of screen width)
    CORNER_THRESHOLD: 0.02,
    // Base color for bank
    BASE_COLOR: 0x345511,
    // Grass colors
    GRASS_COLORS: [
        0x345511, // Base green
        0x4A7A1E, // Lighter green
        0x2D4A0F, // Darker green
        0x5C8A32, // Olive green
        0x3B6619  // Forest green
    ],
    // Grass properties
    GRASS: {
        DENSITY_FACTOR: 0.01, // Lower = more dense
        MIN_HEIGHT: 0.003, // % of screen height
        MAX_HEIGHT: 0.007, // % of screen height
        MIN_ANGLE: -0.2,
        MAX_ANGLE: 0.2,
        OPACITY: 0.8
    }
};

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
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;
    const minScreenDim = Math.min(screenWidth, screenHeight);
    const shadowOffset = 15; // Match lily pad shadow offset

    // Calculate actual values based on screen size
    const variation = minScreenDim * BANK_CONFIG.EDGE_VARIATION;
    const cornerBuffer = minScreenDim * BANK_CONFIG.CORNER_BUFFER;
    const cornerThreshold = minScreenDim * BANK_CONFIG.CORNER_THRESHOLD;

    // Create the shadow first
    const bankShadow = new PIXI.Graphics();
    bankShadow.beginFill(0x000000, 0.2); // Match lily pad shadow opacity
    bankShadow.drawRect(0, 0, screenWidth, screenHeight);
    bankShadow.zIndex = 9; // Just below the bank
    bankShadow.beginHole();

    const bank = new PIXI.Graphics();
    bank.beginFill(BANK_CONFIG.BASE_COLOR);
    bank.drawRect(0, 0, screenWidth, screenHeight);
    bank.zIndex = 10;
    bank.beginHole();

    // Generate edge points
    const edges = {
        top: generateEdgePoints(
            { x: bankThickness + cornerBuffer, y: bankThickness },
            { x: screenWidth - bankThickness - cornerBuffer, y: bankThickness },
            BANK_CONFIG.MIN_EDGE_POINTS,
            BANK_CONFIG.MAX_EDGE_POINTS,
            variation
        ),
        right: generateEdgePoints(
            { x: screenWidth - bankThickness, y: bankThickness + cornerBuffer },
            { x: screenWidth - bankThickness, y: screenHeight - bankThickness - cornerBuffer },
            BANK_CONFIG.MIN_EDGE_POINTS,
            BANK_CONFIG.MAX_EDGE_POINTS,
            variation
        ),
        bottom: generateEdgePoints(
            { x: screenWidth - bankThickness - cornerBuffer, y: screenHeight - bankThickness },
            { x: bankThickness + cornerBuffer, y: screenHeight - bankThickness },
            BANK_CONFIG.MIN_EDGE_POINTS,
            BANK_CONFIG.MAX_EDGE_POINTS,
            variation
        ),
        left: generateEdgePoints(
            { x: bankThickness, y: screenHeight - bankThickness - cornerBuffer },
            { x: bankThickness, y: bankThickness + cornerBuffer },
            BANK_CONFIG.MIN_EDGE_POINTS,
            BANK_CONFIG.MAX_EDGE_POINTS,
            variation
        )
    };

    const allEdgePoints = [
        ...removeCloseToCorners(edges.top, cornerThreshold, bankThickness, app),
        ...removeCloseToCorners(edges.right, cornerThreshold, bankThickness, app),
        ...removeCloseToCorners(edges.bottom, cornerThreshold, bankThickness, app),
        ...removeCloseToCorners(edges.left, cornerThreshold, bankThickness, app)
    ];

    const shadowPoints = allEdgePoints.map(point => {
        // Calculate center of the pond
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;

        // Get vector from center to point
        const dx = point.x - centerX;
        const dy = point.y - centerY;

        // Calculate distance and normalized vector
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / distance;
        const ny = dy / distance;

        // Move point slightly inward
        return {
            x: point.x - nx * shadowOffset,
            y: point.y - ny * shadowOffset
        };
    });

    // Draw shadow edges
    const firstShadowPoint = shadowPoints[0];
    const firstShadowMidx = (firstShadowPoint.x + shadowPoints[1].x) / 2;
    const firstShadowMidy = (firstShadowPoint.y + shadowPoints[1].y) / 2;
    bankShadow.moveTo(firstShadowMidx, firstShadowMidy);
    drawEdges(shadowPoints, bankShadow);
    bankShadow.closePath();
    bankShadow.endHole();
    bankShadow.endFill();

    // Draw bank edges
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
    app.stage.addChild(bankShadow);
    app.stage.addChild(bank);

    // Create grass
    const grassContainer = new PIXI.Graphics();
    grassContainer.zIndex = 11;
    const grassDensity = Math.floor(screenWidth * screenHeight * BANK_CONFIG.GRASS.DENSITY_FACTOR);

    // Draw grass
    for (let i = 0; i < grassDensity; i++) {
        const x = Math.random() * screenWidth;
        const y = Math.random() * screenHeight;

        if (!isInsidePond(x, y, allEdgePoints)) {
            const height = screenHeight * (BANK_CONFIG.GRASS.MIN_HEIGHT +
                Math.random() * (BANK_CONFIG.GRASS.MAX_HEIGHT - BANK_CONFIG.GRASS.MIN_HEIGHT));
            const angle = BANK_CONFIG.GRASS.MIN_ANGLE +
                Math.random() * (BANK_CONFIG.GRASS.MAX_ANGLE - BANK_CONFIG.GRASS.MIN_ANGLE);

            grassContainer.lineStyle(1,
                BANK_CONFIG.GRASS_COLORS[Math.floor(Math.random() * BANK_CONFIG.GRASS_COLORS.length)],
                BANK_CONFIG.GRASS.OPACITY);
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

export { createBank, drawEdges, isInsidePond, BANK_CONFIG };