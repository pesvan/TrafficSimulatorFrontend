class VehicleCoordinates
{
    constructor(initPoint, angle, length, width, situationHeight)
    {
        this.frontCenter = initPoint;

        this.frontCenter.__y = situationHeight - this.frontCenter.y;

        this.backCenter = moveCoordinatesByOffset(this.frontCenter, angle + 180, length);

        this.frontRight = moveCoordinatesByOffset(this.frontCenter, angle + 90, width / 2);

        this.frontLeft = moveCoordinatesByOffset(this.frontCenter, angle - 90, width /2);

        this.backRight = moveCoordinatesByOffset(this.backCenter, angle + 90, width / 2);

        this.backLeft = moveCoordinatesByOffset(this.backCenter, angle - 90, width / 2);

        this.width = width;
        this.length = length;
    }

    getPointsArray()
    {
        return [
            this.frontLeft, this.backLeft, this.backRight, this.frontRight
        ];
    }

    getSignalLeftCoords()
    {
        return [this.length/2, (this.length/2) + this.width + this.length + (this.width/2), this.width/2];
    }

    getSignalRightCoords()
    {
        return [0, this.length + this.width + (this.length/2), (this.width/2) + (this.length/2), this.width/2];
    }

    getPlotPointsArray()
    {
        return [
            [this.frontLeft.__x, this.frontLeft.__y],
            [this.backLeft.__x, this.backLeft.__y],
            [this.backRight.__x, this.backRight.__y],
            [this.frontRight.__x, this.frontRight.__y]
        ];
    }
}