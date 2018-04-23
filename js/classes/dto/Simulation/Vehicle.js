class Vehicle
{
    constructor(id, originalColor, length, width)
    {
        this.id = id;
        this.originalColor = originalColor;
        this.length = length;
        this.width = width;
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

    toString()
    {
        return "<b>ID: </b>" + this.id + "<br>";
    }
}