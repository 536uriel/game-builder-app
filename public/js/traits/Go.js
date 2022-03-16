import { Trait } from '../Entity.js';

// value * deltaTime => stands for dividing the value to the number of frames (fps)

export default class Go extends Trait {
    constructor() {
        super('go');

        //the direction 
        //1 = right
        //-1 = left
        this.dir = 0;
        //speed
        this.acceleration = 400;
        //האטה
        this.deceleration = 300;
        //stands for mitigratting the speed ecceleration property
        this.dragFactor = 1 / 5000;


        this.distance = 0;
        //like tmp direction
        this.heading = 1;
    }

    //override the default update method
    update(entity, deltaTime) {

        let exelerationInput = document.getElementById('exelerationInput').value;

        //the absolute value of velocity 
        const absX = Math.abs(entity.vel.x);;

        if (this.dir !== 0) {
            entity.vel.x += (this.acceleration + (parseInt(exelerationInput))) * deltaTime * this.dir;

            if (entity.jump) {
                if (entity.jump.falling === false) {
                    this.heading = this.dir;
                }
            } else {
                this.heading = this.dir;
            }



        } else if (entity.vel.x !== 0) {
            const decel = Math.min(absX, this.deceleration * deltaTime)
            //mantain the velocity (cause mario stop after running)
            entity.vel.x += entity.vel.x > 0 ? -decel : decel;
        }
        else {
            this.distance = 0;
        }


        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;

        this.distance += absX * deltaTime;
    }
}