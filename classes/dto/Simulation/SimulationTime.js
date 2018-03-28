class SimulationTime
{
    constructor(time)
    {
        this.time = parseInt(time) / 1000.0; // in order to get 225.5 from something like 225500
        this.vehicleStates = [];
    }

    addVehicleState(vehicleState)
    {
        this.vehicleStates.push(vehicleState);
    }
}