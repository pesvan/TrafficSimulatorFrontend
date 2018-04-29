class Leg
{
    constructor(id, angle, inputLaneList, outputLaneList)
    {
        this.id = id;
        this.angle = angle;
        this.inputLaneList = inputLaneList;
        this.outputLaneList = outputLaneList;
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