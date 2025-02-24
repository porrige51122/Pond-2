import Rock from './objects/Rock';
import { isInsidePond } from './createBank';

const addRocks = (app, allEdgePoints) => {
    const rocks = [];
    const minRockSize = 8;
    const maxRockSize = 15;
    const numberOfRocks = 500; // Adjust this number for more/less rocks

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