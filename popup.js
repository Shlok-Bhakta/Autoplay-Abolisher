hbomaxButton = document.getElementById("hbomax");

hbomaxButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["hbomax.js"]
    });
});

button = document.querySelector(".global-button");
function toggleButton() {
    if (button.classList.contains("global-button-on")) {
        button.classList.remove("global-button-on");
        button.classList.add("global-button-off");
    } else {
        button.classList.remove("global-button-off");
        button.classList.add("global-button-on");
    }
}