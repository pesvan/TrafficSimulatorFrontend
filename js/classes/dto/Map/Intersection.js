
class Intersection
{
    constructor(id, coordinates, grid, legList, angle)
    {
        this.id = id;
        this.coordinates = coordinates;
        this.grid = grid;
        this.legList = legList;
        this.angle = angle;
        this.svg = null;
    }

    setSvg(svg)
    {
        this.svg = svg;
    }

    toString()
    {
        return "Intersection number: " + this.id + " grid position: " + this.grid.toPolyString();
    }

}