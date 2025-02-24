import * as PIXI from 'pixi.js';
import { drawEdges } from './createBank';

const createPond = (app, bankThickness, allEdgePoints) => {
    const pond = new PIXI.Graphics();
    pond.beginFill(0x5B85AA); // Blue color for the pond
    pond.moveTo(bankThickness, bankThickness);

    drawEdges(allEdgePoints, pond);

    pond.closePath();
    pond.endFill();
    pond.zIndex = 0;
    app.stage.addChild(pond);
};

export { createPond };