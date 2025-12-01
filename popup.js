const globalButton = document.getElementById("global-button");
const hbomaxToggle = document.getElementById("hbomax-toggle");
const hbomaxFavicon = document.getElementById("hbomax-favicon");
const huluToggle = document.getElementById("hulu-toggle");
const huluFavicon = document.getElementById("hulu-favicon");
const youtubeToggle = document.getElementById("youtube-toggle");
const youtubeFavicon = document.getElementById("youtube-favicon");

async function loadSettings() {
    const result = await chrome.storage.local.get([
        'global_enabled',
        'hbomax_autoplay',
        'hulu_autoplay',
        'youtube_autoplay'
    ]);
    
    // Global button visual state
    globalButton.classList.toggle('global-button-on', result.global_enabled === true);
    globalButton.classList.toggle('global-button-off', result.global_enabled === false);

    // 🔥 Correct state loading
    hbomaxToggle.checked = result.hbomax_autoplay === true;
    huluToggle.checked   = result.hulu_autoplay   === true;
    youtubeToggle.checked = result.youtube_autoplay === true;
    
    if (hbomaxTab && hbomaxTab.favIconUrl) {
        hbomaxFavicon.src = hbomaxTab.favIconUrl;
    }
    if (huluTab && huluTab.favIconUrl) {
        huluFavicon.src = huluTab.favIconUrl;
    }
    if (youtubeTab && youtubeTab.favIconUrl) {
        youtubeFavicon.src = youtubeTab.favIconUrl;
    }
}

function updateGlobalButton() {
    const anyEnabled = hbomaxToggle.checked || huluToggle.checked || youtubeToggle.checked;
    
    if (anyEnabled) {
        globalButton.classList.remove('global-button-off');
        globalButton.classList.add('global-button-on');
    } else {
        globalButton.classList.remove('global-button-on');
        globalButton.classList.add('global-button-off');
    }
}

globalButton.addEventListener('click', async () => {
    const isOn = globalButton.classList.contains('global-button-on');
    
    if (isOn) {
        globalButton.classList.remove('global-button-on');
        globalButton.classList.add('global-button-off');
        hbomaxToggle.checked = false;
        huluToggle.checked = false;
        youtubeToggle.checked = false;
        await chrome.storage.local.set({ global_enabled: false, hbomax_autoplay: false, hulu_autoplay: false, youtube_autoplay: false });
    } else {
        globalButton.classList.remove('global-button-off');
        globalButton.classList.add('global-button-on');
        hbomaxToggle.checked = true;
        huluToggle.checked = true;
        youtubeToggle.checked = true;
        await chrome.storage.local.set({ global_enabled: true, hbomax_autoplay: true, hulu_autoplay: true, youtube_autoplay: true });
    }
});

hbomaxToggle.addEventListener('change', async () => {
    const isEnabled = hbomaxToggle.checked;

    await chrome.storage.local.set({ hbomax_autoplay: isEnabled });

    const any = huluToggle.checked || youtubeToggle.checked || hbomaxToggle.checked;
    await chrome.storage.local.set({ global_enabled: any });

    updateGlobalButton();

    chrome.tabs.create({
        url: "https://play.hbomax.com/settings/playback",
        active: false
    }, (tab) => {

        const hbomaxTabId = tab.id;

        function tabListener(tabId, info) {
            if (tabId === hbomaxTabId && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(tabListener);

                chrome.scripting.executeScript({
                    target: { tabId: hbomaxTabId },
                    files: ["hbomax.js"]
                });
            }
        }

        chrome.tabs.onUpdated.addListener(tabListener);
        chrome.runtime.onMessage.removeListener(closeListener);

        function closeListener(msg) {
            if (msg.action === "hbomax_done") {
                chrome.tabs.remove(hbomaxTabId);
                chrome.runtime.onMessage.removeListener(closeListener);
            }
        }

        chrome.runtime.onMessage.addListener(closeListener);
    });
});




huluToggle.addEventListener('change', async () => {
    const isEnabled = huluToggle.checked;
    await chrome.storage.local.set({ hulu_autoplay: isEnabled });
    updateGlobalButton();
    
    if (isEnabled || huluToggle.checked) {
        await chrome.storage.local.set({ global_enabled: true });
    }
});

youtubeToggle.addEventListener('change', async () => {
    const isEnabled = youtubeToggle.checked;
    await chrome.storage.local.set({ youtube_autoplay: isEnabled });
    updateGlobalButton();
    
    if (isEnabled || youtubeToggle.checked) {
        await chrome.storage.local.set({ global_enabled: true });
    }
});

primeVidButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["primevideo.js"]
    });
});


loadSettings();
