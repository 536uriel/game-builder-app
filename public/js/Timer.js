export default class Timer {

    // deltaTime = fps
    constructor(deltaTime = 1 / 60) {
        let accumulatedTime = 0;
        let lastTime = 0;

        //update the position of mario entity object
        this.updateProxy = (time) => {

            accumulatedTime += (time - lastTime) / 1000;

            if(accumulatedTime > 1) {
                accumulatedTime = 1;
            }

            //if the accumulated time is more then the frame rate
            //update the drawing
            while (accumulatedTime > deltaTime) {
                this.update(deltaTime);

                accumulatedTime -= deltaTime;

            }

            lastTime = time;
            this.enqueue();

        }

    }

    enqueue() {
        requestAnimationFrame(this.updateProxy);
    }

    //start the update loop
    start() {
        this.enqueue();
    }
}