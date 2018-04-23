class SimulationTime
{
    constructor(time)
    {
        this.time = parseInt(time) / 1000.0; // in order to get 225.5 from something like 225500
        this.phaseStates = [];
        this.vehicleStates = [];
        this.tlStates = [];
    }

    addPhaseState(phaseState, tlsId)
    {
        this.phaseStates[tlsId] = phaseState;
    }

    addVehicleState(vehicleState)
    {
        this.vehicleStates.push(vehicleState);
    }

    addTlState(tlState)
    {
        this.tlStates.push(tlState)
    }
}