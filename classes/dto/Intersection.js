
class Intersection
{
    constructor(id, coordinates, legList, angle)
    {
        this.id = id;
        this.coordinates = coordinates;
        this.legList = legList;
        this.angle = angle;
    }

    toString()
    {
        return "Intersection number: " + this.id + " coordinates: " + this.coordinates.toPolyString();
    }

}