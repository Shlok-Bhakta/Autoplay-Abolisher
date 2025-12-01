// Wait for an element to exist in the DOM
function waitForElement(id) {
    return new Promise(resolve => {
        const el = document.getElementById(id);
        if (el) return resolve(el);

        const observer = new MutationObserver(() => {
            const el = document.getElementById(id);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}

// Click the toggle only if its current state differs from desired
function clickIfNeeded(el, desiredState) {
    if (!el) return;

    let isOn = false;

    // Check standard checkbox
    if ("checked" in el) {
        isOn = el.checked;
    }
    // Check aria-checked for styled div switches
    else if (el.getAttribute("aria-checked") !== null) {
        isOn = el.getAttribute("aria-checked") === "true";
    }
    // Optional: check for class-based toggle
    else if (el.classList.contains("on") || el.classList.contains("checked")) {
        isOn = true;
    }

    if (isOn !== desiredState) {
        el.click();
    }
}

(async () => {
    // Wait for all toggle elements
    const previews = await waitForElement("id-AutoplayPreviews");
    const episodes = await waitForElement("id-AutoplayEpisodes");
    const recs = await waitForElement("id-AutoplayRecommendedMovies&Series");

    // Load desired state from chrome.storage.local
    const result = await chrome.storage.local.get(['hbomax_autoplay']);
    const desiredState = result.hbomax_autoplay === true; // true = enable autoplay, false = disable

    // Click only if needed
    await new Promise(r => setTimeout(r, 300));
    clickIfNeeded(previews, desiredState);
    clickIfNeeded(episodes, desiredState);
    clickIfNeeded(recs, desiredState);

    // Notify popup that we're done so it can close the tab
    chrome.runtime.sendMessage({ action: "hbomax_done" });
})();
