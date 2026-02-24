
interface pointInterface {
    x: number;
    y: number;
}

type pointType = {
    x: number;
    y: number;
}

function printPoint(point: pointInterface | pointType): void {
    console.log(`(${point.x}, ${point.y})`);
}

const p1: pointType = {x: 1, y: 2};
const p2: pointInterface = {x: 1, y: 3};
