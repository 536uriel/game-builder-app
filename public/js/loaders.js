import Level from "./Level.js";
import { createBackgroundLayer, createSpriteLayer } from './layers.js';
import SpriteSheet from './SpriteSheet.js';
import TileResolver from "./TileResolver.js";
const tileSize = new TileResolver({}).tileSize;
import { frames } from "./entities.js";


//load the image 
export function loadImage(url) {

    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });

}

export function createBufferImageColor(color, type) {

    const buffer = document.createElement('canvas');

    buffer.width = tileSize;
    buffer.height = tileSize;

    const context = buffer.getContext('2d');

    context.fillStyle = color;

    context.fillRect(0, 0, buffer.width, buffer.height);


    if (type == "ground") {

        context.strokeStyle = "white";

        context.strokeRect(0, 0, buffer.width, buffer.height)
    }


    return buffer;

}

function loadCharactersImage(sheetSpec) {

    //for the character

    let imgPromises = [];


    sheetSpec.frames.forEach(frame => {
        imgPromises.push(new Promise(resolve => {
            const image = new Image();
            image.addEventListener('load', () => {
                resolve(image);
            });
            image.src = frame.imageURL;
        }));
    });


    return imgPromises;

}

function loadJson(url) {
    return fetch(url)
        .then(r => r.json());
}

function createTiles(level, backgrounds) {

    function applyRange(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;
        for (let x = xStart; x < xEnd; x++) {
            for (let y = yStart; y < yEnd; y++) {
                //set the background tiles
                level.tiles.set(x, y, {
                    name: background.tile,
                    type: background.type
                });
            }
        }
    }

    backgrounds.forEach(background => {

        background.ranges.forEach(range => {
            if (range.length === 4) {
                const [xStart, xLen, yStart, yLen] = range;
                applyRange(background, xStart, xLen, yStart, yLen);
            } else if (range.length === 3) {
                const [xStart, xLen, yStart] = range;
                applyRange(background, xStart, xLen, yStart, 1);
            } else if (range.length === 2) {
                const [xStart, yStart] = range;
                applyRange(background, xStart, 1, yStart, 1);
            }
        });

    });

}

export function loadSpriteSheetCharacters(characterSize) {

    //load the json sprite
    return loadJson(`/sprites/character.json`)
        .then(sheetSpec => Promise.all(
            loadCharactersImage(sheetSpec)
        ))
        .then(images => {
            //create a SpriteSheet object and set it 
            //with the tiles and the width/height
            //for all sprites



            const div = document.getElementById('actionsImages');

            for (let i = 0; i < frames.length; i++) {

                const innerImage = new Image();
                const input = document.createElement('input');



                innerImage.width = characterSize;
                innerImage.height = characterSize;
                innerImage.id = frames[i].name;
                innerImage.src = frames[i].imageURL;

                input.type = "checkbox";
                input.value = frames[i].name;
                input.name = "frames";

                div.appendChild(input)
                div.appendChild(innerImage);

            }



            const sprites = new SpriteSheet();


            for (let i = 0; i < frames.length; i++) {
                sprites.defineCharacter(frames[i].name, 0, 0, characterSize, characterSize, images[i]);
            }

            return sprites;

        })
}



//fetch the level json object and return it as a promise
export function loadLevel(name, tileSize, buffer1, buffer3) {
    return loadJson(`/levels/${name}.json`)
        .then((LevelSpec) => {



            const redBuffer = createBufferImageColor("rgb(0,0,0)");
            const blueBuffer = createBufferImageColor("#87a8f2");


            const backgroundSprites = new SpriteSheet(redBuffer);


            //define the tile we want to draw
            backgroundSprites.defineBlock("ground", redBuffer);
            backgroundSprites.defineBlock("sky", blueBuffer);




            const level = new Level();

            //set the matrix of the level
            createTiles(level, LevelSpec.backgrounds);

            //the background layer is a function that draw the background
            const backgroundLayer = createBackgroundLayer(level, backgroundSprites, buffer1);

            level.comp.layers.push(backgroundLayer);

            //sprite layer is a function that draw mario
            const spriteLayer = createSpriteLayer(level.entities, tileSize * 2, tileSize * 2, buffer3);
            level.comp.layers.push(spriteLayer);

            return level;
        });
}