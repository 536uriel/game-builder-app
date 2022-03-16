//represent the grid array of the backgrounds and tiles
export class Matrix {
    constructor() {
        this.grid = [];
    }

    //loops over the grid array and activate a callback function
    forEach(callback) {
        this.grid.forEach((column, x) => {
            //the tile argument represent the tile object in the tiles array
            //and the y arument represent theindex in the array
            column.forEach((value, y) => {
                callback(value, x, y);
            });
        });
    }

    //gets the object from the grids array
    get(x, y) {
        const col = this.grid[x];

        if (col) {
            return col[y];
        }

        return undefined;
    }

    set(x, y, value) {
        if (!this.grid[x]) {
            //initialize new array if empty
            this.grid[x] = [];
        }

        this.grid[x][y] = value;
    }
}

//represent 2d vector
export class Vec2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}
