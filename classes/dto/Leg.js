class Leg
{
    constructor(id, angle, outputLanesCount, coordinates, laneList)
    {
        this.id = id;
        this.angle = angle;
        this.outputLanesCount = outputLanesCount;
        this.coordinates = coordinates;
        this.laneList = laneList;
    }

    setIntersectionBorderCoords(left, right)
    {
        this.leftIntersectionPoint = left;
        this.rightIntersectionPoint = right;
    }

    setEndBorderCoords(left, right)
    {
        this.leftEndPoint = left;
        this.rightEndPoint = right;
    }

    toString(laneId)
    {
        return "Leg "+this.id+", lane "+laneId+", angle "+this.angle;
    }



}