export function createAnim(frames, frameLen) {
    //charge on what frame sould be displayed
    return function resolveFrame(distance) {
        const frameIndex = Math.floor(distance / frameLen) % frames.length;
        const frameName = frames[frameIndex];
        return frameName;
    }
}