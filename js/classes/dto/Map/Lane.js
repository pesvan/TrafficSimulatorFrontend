class Lane
{
    constructor(id, legId, intersectionId, shape, output = false)
    {
        this.id = id;
        this.left = undefined;
        this.right = undefined;
        this.straight = undefined;
        this.output = output;
        this.semaphore = undefined;
        this.svg = undefined;
        this.shape = shape;
        this.legId = legId;
        this.intersectionId = intersectionId;
    }

    isInputLane()
    {
        return !this.output;
    }

    setDirections(left, right, straight)
    {
        this.left = left;
        this.right = right;
        this.straight = straight;
    }

    setSemaphore(semaphore)
    {
        this.semaphore = semaphore;
    }

    setSvg(svg)
    {
        this.svg = svg;
    }

    toString()
    {
       return "Input lane " + this.id + ", directions:" +
        " Left: "
        + (this.left ? "Yes" : "No")
           + ", Right: "
        + (this.right ? "Yes" : "No")
            + ", Straight: "
        + (this.straight ? "Yes" : "No");

    }

    toSelectedString()
    {
        return this.id + "<br>Lane directions:<br>" +
            "Left:"
            + (this.left ? "Yes" : "No")
            + "<br>Right: "
            + (this.right ? "Yes" : "No")
            + "<br>Straight: "
            + (this.straight ? "Yes" : "No");

    }


}