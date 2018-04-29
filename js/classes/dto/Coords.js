class Coords
{
    constructor(x, y, multiply = true)
    {
        if(multiply)
        {
            this.__x = x * visualizationMultiplier;
            this.__y = y * visualizationMultiplier;
        }
        else
        {
            this.__x = x;
            this.__y = y;
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