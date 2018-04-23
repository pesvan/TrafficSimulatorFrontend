let header = document.getElementById("sidebar");
let sticky = header.offsetLeft;

window.onscroll = function() {
    stickToTheTop()
};

function stickToTheTop() {
    if (window.pageXOffset >= sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}