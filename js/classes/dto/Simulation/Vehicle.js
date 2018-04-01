class Vehicle
{
    constructor(id)
    {
        this.id = id;
        this.svg = null;
    }

    vehicleIsSet()
    {
        return this.svg != null;
    }

    setSvg(svg)
    {
        this.svg = svg;
    }
}