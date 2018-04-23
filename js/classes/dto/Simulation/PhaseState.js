class PhaseState
{
    constructor(duration, nextSwitch, phaseId, programId, remaining)
    {
        this.duration = duration;
        this.nextSwitch = nextSwitch;
        this.phaseId = phaseId;
        this.programId = programId;
        this.remaining = remaining;
    }

    toString()
    {
        return "<br><b>Program ID:</b> " + this.programId
        + "<br><b>Phase ID:</b> " +  this.phaseId
        + "<br><b>Time of next switch:</b> " + this.nextSwitch
    }
}