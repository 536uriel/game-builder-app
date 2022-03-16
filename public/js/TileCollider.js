import TileResolver from './TileResolver.js';
import { Sides } from './Entity.js';

export default class TileCollider {
    constructor(tileMatrix) {
        this.tiles = new TileResolver(tileMatrix);
    }


    checkX(entity) {

        let x;

        //if mario is moving to the right
        if (entity.vel.x > 0) {
            //set x to the right of the entity
            x = entity.pos.x + entity.size.x;
            //if mario is moving to the left
        } else if (entity.vel.x < 0) {
            //set x to the left of the entity
            x = entity.pos.x;
        } else {
            return;
        }


        const matches = this.tiles.searchByRange(x, x,
            entity.pos.y, entity.pos.y + entity.size.y);

        matches.forEach(match => {

            if (match.tile.type !== 'ground') {
                return;
            }

            //if mario is moving to the right
            if (entity.vel.x > 0) {
                //if mario passed the ground wall
                if (entity.pos.x + entity.size.x > match.x1) {
                    //move mario to the start of the tile
                    entity.pos.x = match.x1 - entity.size.x;
                    //stop moving right
                    entity.vel.x = 0;
                }
                //if mario is moving left
            } else if (entity.vel.x < 0) {
                //if mario passed the tile 
                if (entity.pos.x < match.x2) {
                    //move mario to the start of the tile
                    entity.pos.x = match.x2;
                    //stop moving left
                    entity.vel.x = 0;
                }
            }

        });
    }

    checkY(entity) {

        let y;

        //if mario is falling
        if (entity.vel.y > 0) {
            //set y to down below of the entity
            y = entity.pos.y + entity.size.y;
            //if mario is jumpping
        } else if (entity.vel.y < 0) {
            //set y to above of the entity
            y = entity.pos.y;
        } else {
            return;
        }


        const matches = this.tiles.searchByRange(entity.pos.x, entity.pos.x + entity.size.x,
            y, y);

        matches.forEach(match => {

            if (match.tile.type !== 'ground') {
                return;
            }

            //if mario is falling
            if (entity.vel.y > 0) {
                //if mario passed the tile down below
                if (entity.pos.y + entity.size.y > match.y1) {
                    //move mario to the start of the tile
                    entity.pos.y = match.y1 - entity.size.y;
                    //stop the falling
                    entity.vel.y = 0;

                    entity.obstruct(Sides.BOTTOM)

                }
                //if mario is jumpping
            } else if (entity.vel.y < 0) {
                //if mario passed the tile above
                if (entity.pos.y < match.y2) {
                    //move mario to the start of the tile
                    entity.pos.y = match.y2;
                    //stop the jumpping
                    entity.vel.y = 0;

                    //check if the entity is tuching the ceilling
                    entity.obstruct(Sides.TOP)
                }
            }

        });
    }

    test(entity) {
        this.checkY(entity);
        const match = this.tiles.searchByPosition(entity.pos.x, entity.pos.y);

        if (match) {
            // console.log('matched', match, match.tile);
        }
    }
}