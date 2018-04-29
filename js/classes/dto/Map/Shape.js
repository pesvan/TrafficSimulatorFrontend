class Shape
{
    constructor(coordinateList, yBoundary, legAngle = undefined, isLane = true)
    {
        this.coordinateList = coordinateList;


        this.angle = legAngle;
        this.isLane = isLane;

        for (let i = 0; i < this.coordinateList.length; i++)
        {
            this.coordinateList[i].__y = ( yBoundary * visualizationMultiplier ) - this.coordinateList[i].__y;
        }

        if (this.angle === undefined && this.isLaneShape())
        {
            this.angle = getLaneAngle(coordinateList[0], coordinateList[1]) + 270;
        }

        if(this.isLaneShape())
        {
            this.setLaneBorderPoints();
        }
    }

    isLaneShape()
    {
        return this.isLane;
    }

    setLaneBorderPoints()
    {
        this.intersectionLeftPoint = moveCoordinatesByOffset(this.coordinateList[0], this.angle + 270 , 8.12);
        this.intersectionRightPoint = moveCoordinatesByOffset(this.coordinateList[0], this.angle + 90, 8.12);
        this.connectionLeftPoint = moveCoordinatesByOffset(this.coordinateList[1], this.angle + 270 , 8.12);
        this.connectionRightPoint = moveCoordinatesByOffset(this.coordinateList[1], this.angle + 90 , 8.12);
    }

    getLanePolygonPoints()
    {
        return [
          this.intersectionRightPoint, this.connectionRightPoint, this.connectionLeftPoint, this.intersectionLeftPoint
        ];
    }
}