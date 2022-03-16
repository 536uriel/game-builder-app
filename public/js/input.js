import KeyBoard from './KeyBoardState.js';

export default class SetupKeyboard {

    constructor(characters) {
        this.input = new KeyBoard();
        this.characters = characters;
        this.charactersCurrentIndex = 0;
        this.jump("P");
        this.run("O")
        this.right("D")
        this.left("A")
    }

    jump(key) {

        //add the space event to the keyboard object
        this.input.addMapping("Key" + key, keyState => {

            if (keyState) {
                //keydown (space) so the keystate is 1
                this.characters[this.charactersCurrentIndex].jump.start();
            } else {
                //if the button (space) was released (keyup) so the keystate is 0
                this.characters[this.charactersCurrentIndex].jump.cancel();
            }
        });
    }

    run(key) {

        this.input.addMapping("Key" + key, keyState => {
            this.characters[this.charactersCurrentIndex].turbo(keyState);
        });


    }

    right(key) {

        this.input.addMapping("Key" + key, keyState => {
            
            //if pressed, the keyState is 1
            this.characters[this.charactersCurrentIndex].go.dir += keyState ? 1 : -1;
        });

    }

    left(key) {


        this.input.addMapping("Key" + key, keyState => {
            //if pressed, the keyState is 1
            this.characters[this.charactersCurrentIndex].go.dir += -keyState ? -1 : 1;
        });

    }


}
