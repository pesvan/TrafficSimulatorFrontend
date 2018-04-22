class Lane
{
    constructor(id, left, right, straight, legId, intersectionId)
    {
        this.id = id;
        this.left = left;
        this.right = right;
        this.straight = straight;
        this.semaphore = undefined;
        this.svg = undefined;
        this.legId = legId;
        this.intersectionId = intersectionId;
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