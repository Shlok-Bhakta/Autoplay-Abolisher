console.log("[Prime Video] Script loaded");

// Track running interval
let primeInterval = null;

// Click function
function clickHideButton() {
    const hideBtn = document.querySelector(".atvwebplayersdk-nextupcardhide-button");
    if (hideBtn) {
        hideBtn.click();
        console.log("[Prime Video] Clicked hide button!");
    }
}

// Start blocker
function startBlocker() {
    if (primeInterval) return; // already running
    console.log("[Prime Video] Starting blocker...");
    primeInterval = setInterval(clickHideButton, 2000);
}

// Stop blocker
function stopBlocker() {
    if (primeInterval) {
        clearInterval(primeInterval);
        primeInterval = null;
        console.log("[Prime Video] Blocker stopped.");
    }
}

// Check setting and start/stop as needed
async function checkAutoplayStatus() {
    const { primevideo_autoplay } = await chrome.storage.local.get("primevideo_autoplay");

    if (primevideo_autoplay) {
        startBlocker();
    } else {
        stopBlocker();
    }
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "checkAutoplayStatus") {
        checkAutoplayStatus();
    }
});

// Run once on page load
setTimeout(checkAutoplayStatus, 1000);
