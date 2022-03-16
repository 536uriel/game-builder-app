//summerize of main.js:
//load the entity and the sprites objects in parallel and the json file as well
//create compositore object and push 
//the layers function to it
//create an input object that handls the events and map the space button to it
//create timer object and append the update function to it
//draw the layers in order in the update function

const buttons = document.getElementsByClassName("btn-drop-down");
const divs = document.getElementsByClassName("e-option");

divs[0].style.display = "none";
for (let i = 0; i < buttons.length; i++) {

    divs[i].style.display = "none";

    buttons[i].addEventListener('click', () => {

        divs[i].style.display = "inline-block";
        for (let i2 = 0; i2 < divs.length; i2++) {
            if (i != i2) {
                divs[i2].style.display = "none";
            }
        }
    });
}


import Camera from './Camera.js';
import Timer from './Timer.js';
import { loadLevel } from './loaders.js';
import { createCharacter, setUpCharacter, characterSize } from './entities.js';
import setupKeyboard from './input.js';
import { createCollisionLayer, createGridLayer, createCameraLayer } from './layers.js';
import { setUpMouseControle } from './debug.js';
import TileResolver from './TileResolver.js';
import { Vec2 } from './math.js';
import Entity from './Entity.js';

const valuesObj = {}

//get the canvas element
const canvas = document.getElementById('screen');
//get the context of the main canvas
const context = canvas.getContext('2d');

const { tileSize } = new TileResolver({});

const camera = new Camera();
const createBuffer1 = document.createElement('canvas');
const createBuffer2 = document.createElement('canvas');
const createBuffer3 = document.createElement('canvas');

createBuffer2.width = tileSize;
createBuffer2.height = tileSize;

valuesObj.buffer2 = createBuffer2;

Promise.all([
    createCharacter(),
    loadLevel("1-1", tileSize, createBuffer1, createBuffer3)
])
    .then(([

        charactersAndSprites,
        //the level object with the defined compositor
        Level
    ]) => {



        valuesObj.checkboxes = document.querySelectorAll("input[type=checkbox][name=tileType]");

        valuesObj.rgb1 = parseInt(document.getElementById("rgb1").value) || 50;
        valuesObj.rgb2 = parseInt(document.getElementById("rgb2").value) || 75;
        valuesObj.rgb3 = parseInt(document.getElementById("rgb3").value) || 1000;

        valuesObj.gravityInputValue = parseInt(document.getElementById('gravityInput').value);





        const { characters, sprites } = charactersAndSprites;

        window.camera = camera;

        characters[0].pos.set(64, 64);


        //add the mario object to the entities array in the level 
        Level.entities.add(characters[0]);

        let entityIndex = 0;

        //the input setup object
        const setUps = new setupKeyboard(characters);

        document.getElementById('saveKeys').addEventListener('click', () => {

            let actions = [];
            let checkboxes = document.querySelectorAll("input[type=checkbox][name=keyMapInput]");
            const key = document.getElementById("keyInput").value;
            // Use Array.forEach to add an event listener to each checkbox.
            checkboxes.forEach(function (checkbox) {
                if (checkbox.checked) {
                    actions.push(checkbox.value);
                }
            });


            if (actions.length && key.length == 1) {
                actions.forEach(action => {
                    setUps[action](key);
                })

                //addEventListener for the keyup and keydown events
                setUps.input.listenTo(window);
            }


        });

        document.getElementById("createCharacter").addEventListener('click', () => {
            entityIndex++;
            const entity = new Entity();
            setUpCharacter(entity, sprites);
            entity.pos.set(100, 100);
            characters.push(entity);
            Level.entities.add(entity);
            


            document.getElementById('saveKeys').addEventListener('click', () => {

                let actions = [];
                let checkboxes = document.querySelectorAll("input[type=checkbox][name=keyMapInput]");
                const key = document.getElementById("keyInput").value;
                // Use Array.forEach to add an event listener to each checkbox.
                checkboxes.forEach(function (checkbox) {
                    if (checkbox.checked) {
                        actions.push(checkbox.value);
                    }
                });


                if (actions.length && key.length == 1) {
                    actions.forEach(action => {
                        setUps[action](key);
                    })

                    //addEventListener for the keyup and keydown events
                    setUps.input.listenTo(window);
                }


            });


        });



        document.getElementById("defineCharacter").addEventListener('click', () => {

            let imagesFrames = [];
            let imagesChecboxses = document.querySelectorAll("input[type=checkbox][name=frames]");

            // Use Array.forEach to add an event listener to each checkbox.
            imagesChecboxses.forEach(function (checkbox) {
                if (checkbox.checked) {
                    imagesFrames.push(checkbox.value);
                }
            });

            let strFrames = [];
            let strFramesChecboxses = document.querySelectorAll("input[type=checkbox][name=createKeyMapInput]");

            // Use Array.forEach to add an event listener to each checkbox.
            strFramesChecboxses.forEach(function (checkbox) {
                if (checkbox.checked) {
                    strFrames.push(checkbox.value);
                }
            });






            if (imagesFrames.length == 1) {
                strFrames.forEach(frame => {
                    const image = new Image();
                    image.src = `./img/${imagesFrames[0]}.png`
                    sprites.defineCharacter(frame, 0, 0, characterSize, characterSize, image);
                })

            }
        });


        let debugLayersMode = true;
        const btnGrid = document.getElementById("btn-grid");
        btnGrid.addEventListener('click', () => {

            //for debugging mode


            if (debugLayersMode) {
                Level.comp.layers.push(createGridLayer(Level, characters));
                Level.comp.layers.push(createCollisionLayer(Level));
                Level.comp.layers.push(createCameraLayer(camera));
                debugLayersMode = false;
            } else {
                Level.comp.changeLayersOrder("drawGridLayer", -1);
                Level.comp.changeLayersOrder("drawCollision", -1);
                Level.comp.changeLayersOrder("drawCameraRect", -1);
                debugLayersMode = true;
            }

        });


        //change layers order
        const btnChangeLayerOrder = document.getElementById("btn-change-layers-order");
        let backgroundLayerPoschanged = false;
        btnChangeLayerOrder.addEventListener('click', () => {


            if (backgroundLayerPoschanged == false) {
                Level.comp.changeLayersOrder("drawBackgroundLayer", 1);
                backgroundLayerPoschanged = true;
            } else {
                Level.comp.changeLayersOrder("drawBackgroundLayer", 0);
                backgroundLayerPoschanged = false;
            }

        });

        //addEventListener for the keyup and keydown events
        setUps.input.listenTo(window);


        //for debugging mode
        setUpMouseControle(canvas, characters[0], camera, Level, valuesObj);


        const timer = new Timer(1 / 60);


        //update the position of mario entity object
        timer.update = function update(deltaTime) {

            const charactersCurrentIndex = parseInt(document.getElementById("characterCurrentIndex").value);


            if(charactersCurrentIndex > -1 && charactersCurrentIndex < characters.length){
                setUps.charactersCurrentIndex = charactersCurrentIndex;
            }
           

            valuesObj.checkboxes = document.querySelectorAll("input[type=checkbox][name=tileType]");

            valuesObj.rgb1 = parseInt(document.getElementById("rgb1").value) || 0;
            valuesObj.rgb2 = parseInt(document.getElementById("rgb2").value) || 0;
            valuesObj.rgb3 = parseInt(document.getElementById("rgb3").value) || 0;

            valuesObj.gravityInputValue = parseInt(document.getElementById('gravityInput').value);


            //update the position of mario
            Level.update(deltaTime, valuesObj);

            let cameraCenter = 120;

            let cameraCenterValue = parseInt(document.getElementById("cameraCenter").value);

            if (cameraCenterValue !== undefined) {
                cameraCenter = cameraCenterValue
            }

            if (characters[0].pos.x > cameraCenter) {
                camera.pos.x = characters[0].pos.x - cameraCenter;
            }

            //draw all layers in an order
            Level.comp.draw(context, camera, valuesObj);

        }

        timer.start();


    });


