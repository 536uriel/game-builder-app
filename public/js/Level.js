import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import { Matrix } from './math.js';

export default class Level {
    constructor() {

        this.gravity = 1500;
        this.totalTime = 0;

        this.comp = new Compositor();
        this.entities = new Set();
        //the tile grid array
        this.tiles = new Matrix();

        this.tileCollider = new TileCollider(this.tiles);
    }
    

    update(deltaTime, valuesObj) {


        this.entities.forEach(entity => {
            //call the traits update function in all entities
            entity.update(deltaTime);

            //update the position of the mario object
            entity.pos.x += entity.vel.x * deltaTime;

            //check the x position of the entity 
            //to not pass the tiles
            this.tileCollider.checkX(entity);

            entity.pos.y += entity.vel.y * deltaTime;

            //check the y position of the entity 
            //to not pass the tiles
            this.tileCollider.checkY(entity);

            let gravityInputValue = valuesObj.gravityInputValue;
            if (gravityInputValue > 0) {
                this.gravity = parseInt(gravityInputValue * 100);
            }

            entity.vel.y += this.gravity * deltaTime;

        });

        this.totalTime += deltaTime;
    }
}