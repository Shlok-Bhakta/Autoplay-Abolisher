if (window.primeVideoAutoplayDisabled) {
    // Stop the interval
    clearInterval(window.primeVideoInterval);
    window.primeVideoAutoplayDisabled = false;
    console.log("Prime Video autoplay disabler STOPPED");
} else {
    // Start the interval
    function disableAutoplay() {
        const hideBtn = document.querySelector(".atvwebplayersdk-nextupcardhide-button");
        
        if (hideBtn) {
            hideBtn.click();
            console.log("Clicked 'Hide' button to stop autoplay");
        }
    }
    
    window.primeVideoInterval = setInterval(disableAutoplay, 1000);
    window.primeVideoAutoplayDisabled = true;
    console.log("Prime Video autoplay disabler STARTED");
}