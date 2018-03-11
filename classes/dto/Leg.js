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
        this.leftIntersectionMost = left;
        this.rightIntersectionMost = right;
    }

    toString(laneId)
    {
        return "Leg "+this.id+", lane "+laneId+", angle "+this.angle;
    }

}