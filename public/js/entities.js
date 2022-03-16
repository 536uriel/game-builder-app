import Entity from './Entity.js';
import Go from './traits/Go.js';
import Jump from './traits/jump.js';
import { loadSpriteSheetCharacters } from './loaders.js';
import { createAnim } from './anim.js';
import TileResolver from "./TileResolver.js";
let { tileSize } = new TileResolver({});
export let characterSize = tileSize * 2;
export let frames = [
    {
        "imageURL": "/img/idle.png",
        "name": "idle"
    },
    {
        "imageURL": "/img/run-1.png",
        "name": "run-1"
    },
    {
        "imageURL": "/img/run-2.png",
        "name": "run-2"
    },
    {
        "imageURL": "/img/run-3.png",
        "name": "run-3"
    },
    {
        "imageURL": "/img/jump.png",
        "name": "jump"
    }
]

const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

export function setUpCharacter(character, sprites) {

    character.size.set(characterSize, characterSize);

    //add the left and right trait
    character.addTrait(new Go());

    //set the speed of mario to be slow at first
    character.go.dragFactor = SLOW_DRAG;

    character.addTrait(new Jump());

    character.turbo = function setTurboState(turboOn) {
        //if pressed, the keyState is 1
        this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;

    }

    const runAnim = createAnim(['run-1', 'run-2', 'run-3'], 8);

    //responsible for what frame of animation should draw
    function routeFrame(character) {

        //stands for skip the first jumpping frame
        if (character.jump.falling) {
            return 'jump';
        }

        if (character.go.distance > 0) {

            if (character.vel.x > 0 && character.go.dir < 0 || character.vel.x < 0 && character.go.dir > 0) {
                return 'run-3'
            }

            //divide the frames between distance
            return runAnim(character.go.distance);
        }
        return "idle";
    }


    character.draw = function drawCharacter(context) {
        sprites.draw(routeFrame(character), context, 0, 0, this.go.heading < 0);
    }
}

export function createCharacter() {

    return loadSpriteSheetCharacters(characterSize)
        .then(sprites => {

            const characters = [];

            characters.push(new Entity());

            setUpCharacter(characters[0], sprites);


            return {
                characters,
                sprites
            };


        });
}