class GridDimensions
{
    constructor(minX, minY, maxX, maxY)
    {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    getGridSizeX()
    {
        return Math.abs(this.minX - this.maxX) + 1;
    }

    getGridSizeY()
    {
        return Math.abs(this.minY - this.maxY) + 1;
    }

    getGridOffsetX()
    {
        return Math.abs(0 - this.minX) + 1;
    }

    getGridOffsetY()
    {
        return Math.abs(0 - this.maxY) + 1;
    }
}