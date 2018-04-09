class VehicleState
{
    constructor(coords, angle, signal, length, width, color)
    {
        this.coords = coords;
        this.angle = angle;
        this.signal = signal;
        this.vehicle = null;
        this.length = length;
        this.width = width;
        this.color = color;
        this.polygonCoordinates = new VehicleCoordinates(this.coords, this.angle, this.length, this.width);
    }

    setVehicle(vehicle)
    {
        this.vehicle = vehicle;
    }

    isSignallingRight()
    {
        let char = this.signal.charAt(this.signal.length-1);
        return char === '1';
    }

    isSignallingLeft()
    {
        let char = this.signal.charAt(this.signal.length-2);
        return char === '1';
    }

    isBraking()
    {
        let char = this.signal.charAt(this.signal.length-4);
        return char === '1';
    }
}