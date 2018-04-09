class VehicleCoordinates
{
    constructor(initPoint, angle, length, width)
    {
        this.frontCenter = initPoint;

        this.backCenter = moveCoordinatesByOffset(this.frontCenter, angle + 180, length);

        this.frontRight = moveCoordinatesByOffset(this.frontCenter, angle + 90, width / 2);

        this.frontLeft = moveCoordinatesByOffset(this.frontCenter, angle - 90, width /2);

        this.backRight = moveCoordinatesByOffset(this.backCenter, angle + 90, width / 2);

        this.backLeft = moveCoordinatesByOffset(this.backCenter, angle - 90, width / 2);
    }

    getPointsArray()
    {
        return [
            this.frontLeft, this.backLeft, this.backRight, this.frontRight
        ];
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