// this solution isn't a great one, especially if the user stays on the page for a while. Basically it just keeps adding the same images to the end of the container and scrolling indefinitely. 

// if you wanted to make this algorithm better on the DOM, you could maybe treat the image container as a stack to pop the images that are off the screen and push the next image in line to the container.

// Also, the links to the images below could break, resulting in broken images being placed into the scrolling container. I would host these images on your own server so nothing happens to them, and you don't take up resources from the other host.

function scrollWindow() {
    var scroll = document.querySelector('.trusted-row');
    if (scroll.offsetWidth + scroll.scrollLeft == scroll.scrollWidth) {
        var container = document.createElement("div");
        container.classList.add("trusted-column");

        var image1 = document.createElement("img");
        image1.src = images[imageIndex];

        container.appendChild(image1);

        scroll.appendChild(container);

        if (imageIndex == images.length - 1) {
            imageIndex = 0;
        } else {
            imageIndex += 2;
        }
    }
    scroll.scrollLeft += 1;
}

function handleScroll() {
    if (scrollStatus == false) {
        startScroll();
        scrollStatus = true;
    } else {
        stopScroll();
        scrollStatus = false;
    }
}

function startScroll() {
    timeout = setInterval(scrollWindow, 20);
    scrollStatus = true;
}

function stopScroll() {
    clearInterval(timeout);
    scrollStatus = false;
}
const images = [
    "https://cdn.d1baseball.com/logos/teams/256/georgemas.png",
    "https://logos-download.com/wp-content/uploads/2016/06/Lockheed_Martin_logo.png",
    "https://www.freepnglogos.com/uploads/google-logo-png/file-google-logo-svg-wikimedia-commons-23.png",
    "https://1000logos.net/wp-content/uploads/2019/11/facebook-logo-png.png",
    "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "https://appcmsprod.viewlift.com/07f03878-2e8b-4f70-a4d9-ebb2a920da80/images/eagle-bank-arena.png",
    "https://logodix.com/logo/1810537.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/1280px-Deloitte.svg.png",
    "https://www.cs.umd.edu/cscareerfair/sites/default/files/cs.umd.edu.openhouse/images/company/mitre_0.png",
    "https://cdn.freelogovectors.net/wp-content/uploads/2019/02/leidos-logo.png",
    "https://cdn.discordapp.com/attachments/620652013088407595/697112575271239811/GMU_foundation.png",
    "https://media.discordapp.net/attachments/620652013088407595/697112610730016778/Sodexo_logo.png",
    "https://pac.gmu.edu/wp-content/uploads/2018/07/cropped-paclogogreen.png",
];
var scrollStatus = false;
var imageIndex = 0;
handleScroll();
document.querySelector('.trusted-row').addEventListener("click", function() {
    handleScroll();
})

console.log("object");