class VehicleState
{
    constructor(coords, angle, signal)
    {
        this.coords = coords;
        this.angle = angle;
        this.signal = signal;
        this.vehicle = null;

    }

    setVehicle(vehicle)
    {
        this.vehicle = vehicle;
    }
}