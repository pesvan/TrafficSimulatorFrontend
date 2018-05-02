class PhaseState
{
    constructor(nextSwitch, phaseId, programId)
    {
        this.nextSwitch = nextSwitch;
        this.phaseId = phaseId;
        this.programId = programId;
    }

    toString()
    {
        return "<br><b>Program ID:</b> " + this.programId
        + "<br><b>Phase ID:</b> " +  this.phaseId
        + "<br><b>Time of next switch:</b> " + this.nextSwitch
    }
}