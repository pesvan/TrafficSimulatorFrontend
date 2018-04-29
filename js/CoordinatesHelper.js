function moveCoordinatesByOffset(coordinates, angle, offset)
{

    let sinus = Math.sin(degreesToRadians(angle));
    let cosinus = Math.cos(degreesToRadians(angle)) * -1;

    let newX = coordinates.x + (sinus * offset);
    let newY = coordinates.y + (cosinus * offset);

    return new Coords(newX, newY, false);
}

function degreesToRadians(degrees)
{
    return degrees * Math.PI / 180;
}

function getLaneAngle(coordinates1, coordinates2) {
    let dy = coordinates2.y - coordinates1.y;
    let dx = coordinates2.x - coordinates1.x;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)



    return theta;
}
