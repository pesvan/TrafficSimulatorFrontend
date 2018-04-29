class Vehicle
{
    constructor(id, originalColor, length, width)
    {
        this.id = id;
        this.originalColor = originalColor;
        this.length = length;
        this.width = width;
        this.svg = null;
        this.lastTouchedSimStep = undefined;
    }

    setLastTouchedSimStep(simStep)
    {
        this.lastTouchedSimStep = simStep;
    }

    vehicleIsSet()
    {
        return this.svg != null;
    }

    setSvg(svg)
    {
        this.svg = svg;
    }

    removeSvg()
    {
        this.svg.remove();
    }

    toString()
    {
        return "<b>ID: </b>" + this.id + "<br>";
    }
}