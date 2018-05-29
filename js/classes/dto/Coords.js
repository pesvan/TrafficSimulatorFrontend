class Coords
{
    constructor(x, y, multiply = true)
    {
        this.__x = x;
        this.__y = y;

        if(multiply)
        {
            this.__x = this.__x * visualizationMultiplier;
            this.__y = this.__y * visualizationMultiplier;
        }
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

    equals(otherCoords)
    {
        return this.__x === otherCoords.__x && this.__y === otherCoords.__y;
    }

}