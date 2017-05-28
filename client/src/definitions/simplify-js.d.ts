interface Point {
    x: number;
    y: number;
}

type Points = Point[];

declare function simplify(Points, number, boolean);

export = simplify;