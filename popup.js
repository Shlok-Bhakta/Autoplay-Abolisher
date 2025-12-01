const globalButton = document.getElementById("global-button");
const hbomaxToggle = document.getElementById("hbomax-toggle");
const hbomaxFavicon = document.getElementById("hbomax-favicon");
const huluToggle = document.getElementById("hulu-toggle");
const huluFavicon = document.getElementById("hulu-favicon");
const youtubeToggle = document.getElementById("youtube-toggle");
const youtubeFavicon = document.getElementById("youtube-favicon");

async function loadSettings() {
    const result = await chrome.storage.local.get(['global_enabled', 'hbomax_autoplay', 'hulu_autoplay', 'youtube_autoplay']);
    
    if (result.global_enabled === false) {
        globalButton.classList.remove('global-button-on');
        globalButton.classList.add('global-button-off');
    } else {
        globalButton.classList.remove('global-button-off');
        globalButton.classList.add('global-button-on');
    }
    
    hbomaxToggle.checked = result.hbomax_autoplay !== false;
    huluToggle.checked = result.hulu_autoplay !== false;
    youtubeToggle.checked = result.youtube_autoplay !== false;
    
    const tabs = await chrome.tabs.query({});
    const hbomaxTab = tabs.find(tab => tab.url && tab.url.includes('hbomax.com'));
    const huluTab = tabs.find(tab => tab.url && tab.url.includes('hulu.com'));
    const youtubeTab = tabs.find(tab => tab.url && tab.url.includes('youtube.com'));
    
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
    updateGlobalButton();
    
    if (isEnabled || hbomaxToggle.checked) {
        await chrome.storage.local.set({ global_enabled: true });
    }
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

loadSettings();
