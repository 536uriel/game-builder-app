import TileResolver from "./TileResolver.js";

const tileRes = new TileResolver({});

export function setUpMouseControle(canvas, entity, camera, level, valuesObj) {

    let tileValue = "sky";


    ['mousedown', 'mousemove'].forEach(eventNmae => {
        canvas.addEventListener(eventNmae, event => {



            if (event.buttons === 1) {
                entity.vel.set(0, 0);
                entity.pos.set(
                    event.offsetX + camera.pos.x,
                    event.offsetY + camera.pos.y
                );


                level.tiles.set(tileRes.toIndex(parseInt(event.offsetX) + camera.pos.x), tileRes.toIndex(parseInt(event.offsetY) + camera.pos.y), {
                    name: tileValue,
                    type: tileValue,
                });

            }

            // console.log((tileRes.toIndex(parseInt(event.offsetX) + camera.pos.x)), tileRes.toIndex(parseInt(event.offsetY) + camera.pos.y),event.offsetX,event.offsetY,"tileSize: " + tileRes.tileSize)

        })
    });

    // Select all checkboxes with the name 'settings' using querySelectorAll.
    var checkboxes = valuesObj.checkboxes;
    let tilesTypes = []



    // Use Array.forEach to add an event listener to each checkbox.
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            tilesTypes =
                Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
                    .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
                    .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

            tileValue = tilesTypes[0];
            console.log(tileValue)

        })
    });


    canvas.addEventListener('contextMenu', event => {
        event.preventDefault();
    });
}

