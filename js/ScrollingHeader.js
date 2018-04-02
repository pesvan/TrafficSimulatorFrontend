let header = document.getElementById("header");
let sticky = header.offsetTop;

window.onscroll = function() {
    stickToTheTop()
};

function stickToTheTop() {
    if (window.pageYOffset >= sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}