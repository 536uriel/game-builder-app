import { Sides, Trait } from '../Entity.js';

export default class Jump extends Trait {
    constructor() {
        super('jump');

        this.ready = 0;
        //the jump long
        this.duration = 0.3;
        this.velocity = 200;
        //charge on when to start or stop the velocity on the entity
        this.engageTime = 0;
        this.requestTime = 0;
        this.gracePeriod = 0.1;
        this.speedBost = 0.3;

        //added
        this.heightJumpInputValue = 0;
        this.currentTimesJump = 1;
    }

    get falling() {
        return this.ready < 0;
    }

    //start jumpping
    start() {
        
        //start to jump => requestTime > 0
        this.requestTime = this.gracePeriod;
        if (this.currentTimesJump > 0) {
            this.currentTimesJump--;
        }

    }


    //cancel the jump
    cancel() {
        this.engageTime = 0;
        this.requestTime = 0;

    }


    obstruct(entity, side) {
        if (side === Sides.BOTTOM) {
            //can start jumpping
            this.ready = 1;

            this.heightJumpInputValue = parseInt(document.getElementById('heightJumpInput').value);
            let timesJumpInputValue = parseInt(document.getElementById('timesJumpInput').value);

            if (timesJumpInputValue >= 0) {
                this.currentTimesJump = timesJumpInputValue;
                this.currentTimesJump++;


            }

        } else if (side === Sides.TOP) {
            //if mario is toutching the ceiling - cancel the jump
            this.cancel();
        }
    }

    //override the default update method
    update(entity, deltaTime) {

        //if we pressed the button we start to look for
        //opportunity to jump
        if (this.requestTime > 0) {
            if (this.currentTimesJump > 0) {
                //trigger the jumpping velocity
                this.engageTime = this.duration;
                this.requestTime = 0;

            }

            this.requestTime -= deltaTime;

        }

        //when the jump button is triggered
        if (this.engageTime > 0) {
            entity.vel.y = -((this.velocity + Math.abs(entity.vel.x) * this.speedBost) + this.heightJumpInputValue);
            //decrease 1 frame ( 1 / 60 ) from the engageTime (half sec) causing to the jump to be loawer while going up
            this.engageTime -= deltaTime;
        }

        //when we updating the jump we want make sure that 
        //mario wont jump twice
        this.ready--;
    }
}
