import Rock from './objects/Rock';
import { isInsidePond } from './createBank';

const addRocks = (app, allEdgePoints) => {
    const rocks = [];
    const minRockSize = Math.min(app.screen.width, app.screen.height) * 0.01; // 1% of screen
    const maxRockSize = Math.min(app.screen.width, app.screen.height) * 0.015; // 1.5% of screen
    const numberOfRocks = Math.floor((app.screen.width + app.screen.height) * 0.2); // Relative to perimeter


    // Generate random rocks
    for (let i = 0; i < numberOfRocks; i++) {
        const rockSize = Math.random() * (maxRockSize - minRockSize) + minRockSize;
        const x = Math.random() * app.screen.width;
        const y = Math.random() * app.screen.height;

        if (!isInsidePond(x, y, allEdgePoints)) {
            const rock = new Rock(x, y, rockSize);
            rock.graphics.zIndex = 3;
            rocks.push(rock);
        }
    }

    return rocks;
};

export { addRocks };