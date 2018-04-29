class ConnectingLeg
{
    constructor(id, leg1, leg2, shape)
    {
        this.id = id;
        this.leg1 = leg1;
        this.leg2 = leg2;
        this.shape = shape;
    }

    toString()
    {
        return "Connecting leg id: " + this.id;
    }
}