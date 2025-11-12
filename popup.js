hbomaxButton = document.getElementById("hbomax");

hbomaxButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["hbomax.js"]
    });
});