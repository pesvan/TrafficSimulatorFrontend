class Semaphore
{
    constructor(greenSvg, yellowSvg, redSvg)
    {
        this.greenSvg = greenSvg;
        this.yellowSvg = yellowSvg;
        this.redSvg = redSvg;
    }

    setGreen()
    {
        this.setGreenOn();
        this.setYellowOff();
        this.setRedOff();
    }

    setYellow()
    {
        this.setGreenOff();
        this.setYellowOn();
        this.setRedOff();
    }

    setRed()
    {
        this.setGreenOff();
        this.setYellowOff();
        this.setRedOn();
    }

    setYellowRed()
    {
        this.setGreenOff();
        this.setYellowOn();
        this.setRedOn();
    }

    setGreenOn()
    {
        this.greenSvg.fill({ color: greenColor });
    }

    setGreenOff()
    {
        this.greenSvg.fill({ color: blackColor });
    }

    setYellowOn()
    {
        this.yellowSvg.fill({ color: yellowColor });
    }

    setYellowOff()
    {
        this.yellowSvg.fill({ color: blackColor });
    }

    setRedOn()
    {
        this.redSvg.fill({ color: redColor });
    }

    setRedOff()
    {
        this.redSvg.fill({ color: blackColor });
    }

    turnOff()
    {
        this.setGreenOff();
        this.setYellowOff();
        this.setRedOff();
    }
}