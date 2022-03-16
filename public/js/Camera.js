import { Vec2 } from './math.js';
import TileResolver from './TileResolver.js';

const tileSize = new TileResolver({}).tileSize;


export default class Camera {
    constructor() {
        this.pos = new Vec2(0,0);
        this.size = new Vec2(tileSize * 10,tileSize * 14);
    }
}