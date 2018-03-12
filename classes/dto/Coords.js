class Coords
{
    constructor(x, y)
    {
        this.__x = parseFloat(x);
        this.__y = parseFloat(y);
    }

    toPolyString()
    {
        return this.__x + "," + this.__y;
    }

    get x()
    {
        return this.__x;
    }

    get y()
    {
        return this.__y;
    }


}