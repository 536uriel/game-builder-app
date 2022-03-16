//appointed to draw the layers in an order
export default class Compositor {
    constructor() {
        //array of drawing function
        this.layers = [];
    }

    //activate the drawing function in each layer
    draw(context, camera, valuesObj) {
        this.layers.forEach(layer => {

            layer(context, camera, valuesObj);

        });
    }

    changeLayersOrder(layer, moveToIndex) {

        if (moveToIndex > this.layers.length) {
            return;
        }

        let currentIndex = undefined;

        for (let i = 0; i < this.layers.length; i++) {

            if (this.layers[i].name == layer) {
                currentIndex = i;
            }
        }

        if (currentIndex != undefined) {
            if (moveToIndex == -1) {
                this.layers.splice(currentIndex, 1);
            }
            else {

                let tmpLayer = this.layers[currentIndex];
                this.layers[currentIndex] = this.layers[moveToIndex];
                this.layers[moveToIndex] = tmpLayer;
            }

        }


    }
}
