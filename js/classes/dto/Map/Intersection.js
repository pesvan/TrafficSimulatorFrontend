
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

    is2Legs180()
    {
        if (this.legList.length === 2)
        {
            let angle1 = this.legList[0].angle;
            let angle2 = this.legList[1].angle;

            return Math.abs(angle1 - angle2) === 180;
        }
        return false;
    }

}