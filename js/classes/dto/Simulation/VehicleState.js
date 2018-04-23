class VehicleState
{
    constructor(coords, angle, signal, speed, distance, waitingTime)
    {
        this.coords = coords;
        this.angle = angle;
        this.signal = signal;
        this.vehicle = null;


        this.speed = speed;
        this.distance = distance;
        this.waitingTime = waitingTime;
    }

    setVehicle(vehicle)
    {
        this.vehicle = vehicle;
        this.polygonCoordinates = new VehicleCoordinates(this.coords, this.angle, this.vehicle.length, this.vehicle.width);
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

    toString()
    {
        return "<b>Speed: </b>" + this.speed + " km/h<br>"
        + "<b>Distance: </b>" + this.distance + " m<br>"
        + "<b>Waiting time: </b>" + this.waitingTime + " s<br>";
    }
}