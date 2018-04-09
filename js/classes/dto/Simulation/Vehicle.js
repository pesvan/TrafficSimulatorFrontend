class Vehicle
{
    constructor(id)
    {
        this.id = id;
        this.svg = null;
        this.leftBlinkerSvg = null;
        this.rightBlinkerSvg = null;
        this.leftBrakeSvg = null;
        this.rightBrakeSvg = null;
    }

    vehicleIsSet()
    {
        return this.svg != null;
    }

    setSvg(svg)
    {
        this.svg = svg;
    }

    setBlinkers(left, right)
    {
        this.leftBlinkerSvg = left;
        this.rightBlinkerSvg = right;
    }

    setBrakes(left, right)
    {
        this.leftBrakeSvg = left;
        this.rightBrakeSvg = right;
    }

    removeSvg()
    {
        this.svg.remove();
        this.leftBlinkerSvg.remove();
        this.leftBrakeSvg.remove();
        this.rightBlinkerSvg.remove();
        this.rightBrakeSvg.remove();
    }
}