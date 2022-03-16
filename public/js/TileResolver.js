export default class TileResolver {
    constructor(matrix, tileSize = 40) {
        this.matrix = matrix;
        this.screenWidthIndex = 15;
        this.screenHeightIndex = 15;
        let Maincanvas = document.getElementById("screen");
        this.tileSize = parseInt(Maincanvas.height / this.screenHeightIndex) || tileSize;

    }

    //take the actual pixel position and return the index of the grid
    toIndex(pos) {
        return Math.floor(pos / this.tileSize);
    }

    //find the indexes between 2 pixel position and return them as an array
    toIndexRange(pos1, pos2) {
        //rounding the max range in order to block mario from moving forward
        const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
        const range = [];
        let pos = pos1;

        //this loop push all tile indexes in the range array
        do {
            range.push(this.toIndex(pos));
            pos += this.tileSize;
        } while (pos < pMax);

        return range;
    }

    //get the tile from the metrix array 
    //and return the tile + the pixel ranges in an object
    getByIndex(indexX, indexY) {
        const tile = this.matrix.get(indexX, indexY);

        if (tile) {

            //the actual pixel of the x position
            const x1 = indexX * this.tileSize;
            //the end of the x tile position
            const x2 = x1 + this.tileSize;
            //the actual pixel of the y position
            const y1 = indexY * this.tileSize;
            //the end of the y tile position
            const y2 = y1 + this.tileSize;

            return {
                tile,
                x1,
                x2,
                y1,
                y2
            }
        } else {
            return undefined;
        }
    }

    //return the tile and the positions in an object 
    //with the actual pixel position
    searchByPosition(posX, posY) {
        return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
    }

    //getting 4 pixels coordinates and returns array of objects
    //with the tiles and the positions in it
    searchByRange(x1, x2, y1, y2) {
        const matches = [];
        this.toIndexRange(x1, x2).forEach(indexX => {
            this.toIndexRange(y1, y2).forEach(indexY => {
                const match = this.getByIndex(indexX, indexY);
                if (match) {
                    matches.push(match);
                }
            });
        });

        return matches;
    }
}