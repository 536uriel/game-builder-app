import TileResolver from "./TileResolver.js";

const tileRes = new TileResolver({});
const tileSize = tileRes.tileSize;

export default class SpriteSheet {
    constructor(image, width = tileSize, height = tileSize) {
        //get the image from the load image function
        this.image = image;
        //the width of the sprite
        this.width = width;
        //the height of the sprite
        this.height = height;
        //the tiles map object
        this.tiles = new Map();

        this.animations = new Map();
    }

    defineAnim(name, animation) {
        this.animations.set(name, animation)
    }


    defineCharacter(name, x, y, width, height, image) {


        const buffers = [true, false].map(flip => {


            //create canvas element and store it in a buffer
            const buffer = document.createElement('canvas');
            //set the width of the buffer
            buffer.width = width;
            //set the height of the buffer
            buffer.height = height;


            const context = buffer.getContext('2d');

            if (flip) {
                context.scale(-1, 1);
                context.translate(-width, 0);
            }

            //this function draws the tile image on the buffer 
            //but not on the main canvas yet.

            context.drawImage(
                //the tile image
                image,
                //this argument represent what we whant to draw
                //start from x position. we need to multiply the 
                //x argument with the width to get the correct tile
                x,
                //this argument represent what we whant to draw
                //start from y position 
                y,
                //the width of the image
                image.width,
                //the height of the image
                image.height,
                //where to start drawing from x position
                0,
                //where to start drawing from y position
                0,
                //the actual width of the drawing
                width,
                //the actual height of the drawing
                height
            );


            return buffer;
        });



        //store the buffer in the map object
        this.tiles.set(name, buffers);

    }

    defineBlock(name, buffer) {

        //store the buffer in the map object
        this.tiles.set(name, buffer);

    }

    //draw the buffer on the canvas
    draw(name, context, x, y, flip = false) {
        //get the right tile from the map object
        const buffer = this.tiles.get(name)[flip ? 1 : 0];
        //draw the tile on x and y position
        context.drawImage(buffer, x, y);
    }

    drawAnim(name, context, x, y, distance) {
        //get the animation function wich return the animations frames name
        console.log(this.animations.get(name))
        const animation = this.animations.get(name);
        this.drawTile(animation(distance), context, x, y)
    }

    //this function considerring the tile sizes 
    //and uses the draw function to draw
    drawTile(name, context, x, y) {
        //get the right tile from the map object   

    
        const buffer = this.tiles.get(name);
        context.drawImage(buffer, x * tileSize, y * tileSize);


    }

}