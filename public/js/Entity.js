import { Vec2 } from "./math.js";

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom')
};

export class Trait {
    constructor(name) {
        this.NAME = name;
    }

    obstruct() {

    }

    update() {
        console.warn('unhandled update call in Trait');
    }
}

export default class Entity {
    constructor() {
        //the position of the entity
        this.pos = new Vec2(0, 0);
        //the velocity of the entity
        this.vel = new Vec2(0, 0);
        //the size of the entity
        this.size = new Vec2(0, 0);

        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    obstruct(side) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side);
        });
    }

    //activate the triats update method for the current entity
    update(deltaTime) {

        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        });
    }
}