
const PRESSED = 1;
const RELEASED = 0;

export default class KeyBoardState {
    constructor() {
        //holds the current state on a given key - preesed or relesed
        this.keyStates = new Map();

        //holds the callback functions for a key code
        this.keyMap = new Map();
    }

    //add a function to a code
    addMapping(code, callback) {
        this.keyMap.set(code, callback);
    }

    handleEvent(event) {
        //extract the code from the event
        const { code } = event;

        //did not have key mapped
        if (!this.keyMap.has(code)) {

            return;
        }

        //if the key mapped this method prevent 
        //the page from scrolling up or down
        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

        //if the current keyState is the same as before - return undefined
        if (this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);

        //fire the callback function for a single key
        this.keyMap.get(code)(keyState);
    }

    listenTo(window) {

        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });
        })
    }
}