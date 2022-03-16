//create a buffer with the background in it 
//and return a function that draw that buffer on the context
import TileResolver from "./TileResolver.js";
import { createBufferImageColor } from "./loaders.js";

const tileRes = new TileResolver({});
const { tileSize, screenWidthIndex, screenHeightIndex } = tileRes;




export function createBackgroundLayer(level, backgroundSprites, buffer1) {


    const tiles = level.tiles;
    const resolver = level.tileCollider.tiles;



    //the actual screen drawing - not the main canvas

    buffer1.width = tileSize * screenWidthIndex;
    buffer1.height = tileSize * screenHeightIndex;

    const context = buffer1.getContext('2d');

    let startIndex, endIndex;


    //draw the tiles as needed - just drawing the camera area
    function redraw(drawFrom, drawTo, valuesObj) {

        let colorBuffer = createBufferImageColor(`rgb(${valuesObj.rgb1},${valuesObj.rgb2},${valuesObj.rgb3})`, "ground");


        backgroundSprites.defineBlock("ground", colorBuffer)

        startIndex = drawFrom;
        endIndex = drawTo;

        for (let x = startIndex; x <= endIndex; x++) {
            const col = tiles.grid[x];
            if (col) {
                //loops over the grid array in the level object 
                //and draw the tiles
                col.forEach((tile, y) => {

                    if (backgroundSprites.animations.has(tile.name)) {
                        backgroundSprites.drawAnim(tile.name, context, x - startIndex, y, level.totalTime);
                    } else {

                        backgroundSprites.drawTile(tile.name, context, x - startIndex, y);
                    }

                });
            }
        }
    }


    return function drawBackgroundLayer(context, camera, valuesObj) {

        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo, valuesObj);

        context.drawImage(buffer1,
            -camera.pos.x % tileSize,
            -camera.pos.y);
    }
}

//return function that draws all the entities
export function createSpriteLayer(entities, width = 64, height = 64, buffer) {

    const spriteBuffer = buffer
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawSpriteLayer(context, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);

            //draw mario on the canvas object
            entity.draw(spriteBufferContext);

            //draw the mario-canvas-object on the main canvas
            context.drawImage(spriteBuffer,
                entity.pos.x - camera.pos.x,
                entity.pos.y - camera.pos.y);
        })
    }
}

export function createGridLayer(level, entities) {
    return function drawGridLayer(context, camera) {
        //draw the grid debugger
        for (let x = 0; x < level.tiles.grid.length; x++) {

            context.strokeStyle = 'green';
            context.beginPath();
            context.moveTo(x * tileSize, 0);
            context.lineTo(x * tileSize, camera.size.y);
            context.stroke();

        }

        for (let y = 0; y < level.tiles.grid[0].length; y++) {

            context.strokeStyle = 'yellow';
            context.beginPath();
            context.moveTo(0, y * tileSize);
            context.lineTo(camera.size.x, y * tileSize);
            context.stroke();

        }

        context.font = "30px Arial";
        context.fillText("x: " + tileRes.toIndex(parseInt(entities[0].pos.x)) + " (פיקסלים: " + parseInt(entities[0].pos.x) + ")", 5, tileSize);
        context.fillText("y: " + tileRes.toIndex(parseInt(entities[0].pos.y)) + " (פיקסלים: " + parseInt(entities[0].pos.y) + ")", 5, tileSize * 2);

    }
}

//return function that draws boxes for dwbugging puposes
export function createCollisionLayer(level) {

    const resolvedTiles = [];

    const TileResolver = level.tileCollider.tiles;
    const tileSize = TileResolver.tileSize;

    //store the original getByIndex function in a value
    const getByIndexOriginal = TileResolver.getByIndex;

    //override the getByIndex function in the object
    //note: if you override function in other value, it will 
    //still be overrited
    TileResolver.getByIndex = function getByIndexFake(x, y) {

        resolvedTiles.push({ x, y });

        //call the original getByIndex  function after the fake one 
        //in order to not override the original function complitly
        return getByIndexOriginal.call(TileResolver, x, y);
    }

    //draw blue box arround the checking area
    return function drawCollision(context, camera) {


        //draw red box around the entities
        context.strokeStyle = 'red';
        level.entities.forEach(entity => {
            context.beginPath();
            context.rect(entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y, entity.size.x, entity.size.y);
            context.stroke();
        });

        //draw the cheacking area
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({ x, y }) => {
            context.beginPath();
            context.rect((x * tileSize) - camera.pos.x, (y * tileSize) - camera.pos.y, tileSize, tileSize);
            context.stroke();
        });

        resolvedTiles.length = 0;
    }
}

//drawing the camera boundries for debugging purposes
export function createCameraLayer(cameraToDraw) {
    return function drawCameraRect(context, fromCamera) {
        context.strokeStyle = 'purple';
        context.beginPath();
        context.rect(
            cameraToDraw.pos.x - fromCamera.pos.x,
            cameraToDraw.pos.y - fromCamera.pos.y,
            cameraToDraw.size.x, cameraToDraw.size.y);
        context.stroke();
    }
}