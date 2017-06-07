declare module "simplify-js" {
    interface Point {
        x: number;
        y: number;
    }

    type Points = Point[];

    function simplify(points: Points, tolerance: number, highQuality: boolean): Points;

    export = simplify;
}