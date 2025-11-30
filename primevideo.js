function disableAutoplay(){
    const hideBtn = document.querySelector(".atvwebplayersdk-nextupcardhide-button");

     if (hideBtn) {
        hideBtn.click();
        console.log("Clicked 'Hide' button to stop autoplay");
    }
}

setInterval(disableAutoplay, 1000);