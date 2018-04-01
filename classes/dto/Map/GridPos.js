class GridPos {
    constructor(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }

    toPolyString()
    {
        return this.x + "," + this.y;
    }
}
