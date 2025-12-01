const globalButton = document.getElementById("global-button");
const hbomaxToggle = document.getElementById("hbomax-toggle");
const hbomaxFavicon = document.getElementById("hbomax-favicon");
const hbomaxItem = document.getElementById("hbomax-item");
const huluToggle = document.getElementById("hulu-toggle");
const huluFavicon = document.getElementById("hulu-favicon");
const huluItem = document.getElementById("hulu-item");
const primevideoToggle = document.getElementById("primevideo-toggle");
const primevideoFavicon = document.getElementById("primevideo-favicon");
const primevideoItem = document.getElementById("primevideo-item");
const youtubeToggle = document.getElementById("youtube-toggle");
const youtubeFavicon = document.getElementById("youtube-favicon");
const youtubeItem = document.getElementById("youtube-item");
const noTabsMessage = document.getElementById("no-tabs-message");

async function loadSettings() {
    const result = await chrome.storage.local.get(['global_enabled', 'hbomax_autoplay', 'hulu_autoplay', 'primevideo_autoplay', 'youtube_autoplay']);
    
    if (result.global_enabled === false) {
        globalButton.classList.remove('global-button-on');
        globalButton.classList.add('global-button-off');
    } else {
        globalButton.classList.remove('global-button-off');
        globalButton.classList.add('global-button-on');
    }
    
    hbomaxToggle.checked = result.hbomax_autoplay !== false;
    huluToggle.checked = result.hulu_autoplay !== false;
    primevideoToggle.checked = result.primevideo_autoplay !== false;
    youtubeToggle.checked = result.youtube_autoplay !== false;
    
    const tabs = await chrome.tabs.query({});
    const hbomaxTab = tabs.find(tab => tab.url && tab.url.includes('hbomax.com'));
    const huluTab = tabs.find(tab => tab.url && tab.url.includes('hulu.com'));
    const primevideoTab = tabs.find(tab => tab.url && (tab.url.includes('primevideo.com') || tab.url.includes('amazon.com/gp/video')));
    const youtubeTab = tabs.find(tab => tab.url && tab.url.includes('youtube.com'));
    
    let hasAnyTab = false;
    
    if (hbomaxTab) {
        hbomaxItem.style.display = 'flex';
        hasAnyTab = true;
        hbomaxFavicon.src = hbomaxTab.favIconUrl || 'https://www.max.com/favicon.ico';
        hbomaxFavicon.onerror = () => { hbomaxFavicon.src = 'https://www.max.com/favicon.ico'; };
    }
    if (huluTab) {
        huluItem.style.display = 'flex';
        hasAnyTab = true;
        huluFavicon.src = huluTab.favIconUrl || 'https://www.hulu.com/favicon.ico';
        huluFavicon.onerror = () => { huluFavicon.src = 'https://www.hulu.com/favicon.ico'; };
    }
    if (primevideoTab) {
        primevideoItem.style.display = 'flex';
        hasAnyTab = true;
        primevideoFavicon.src = primevideoTab.favIconUrl || 'https://www.primevideo.com/favicon.ico';
        primevideoFavicon.onerror = () => { primevideoFavicon.src = 'https://www.primevideo.com/favicon.ico'; };
    }
    if (youtubeTab) {
        youtubeItem.style.display = 'flex';
        hasAnyTab = true;
        youtubeFavicon.src = youtubeTab.favIconUrl || 'https://www.youtube.com/favicon.ico';
        youtubeFavicon.onerror = () => { youtubeFavicon.src = 'https://www.youtube.com/favicon.ico'; };
    }
    
    noTabsMessage.style.display = hasAnyTab ? 'none' : 'block';
}

function updateGlobalButton() {
    const anyEnabled = hbomaxToggle.checked || huluToggle.checked || primevideoToggle.checked || youtubeToggle.checked;
    
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
        primevideoToggle.checked = false;
        youtubeToggle.checked = false;
        await chrome.storage.local.set({ global_enabled: false, hbomax_autoplay: false, hulu_autoplay: false, primevideo_autoplay: false, youtube_autoplay: false });
    } else {
        globalButton.classList.remove('global-button-off');
        globalButton.classList.add('global-button-on');
        hbomaxToggle.checked = true;
        huluToggle.checked = true;
        primevideoToggle.checked = true;
        youtubeToggle.checked = true;
        await chrome.storage.local.set({ global_enabled: true, hbomax_autoplay: true, hulu_autoplay: true, primevideo_autoplay: true, youtube_autoplay: true });
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

primevideoToggle.addEventListener('change', async () => {
    const isEnabled = primevideoToggle.checked;
    await chrome.storage.local.set({ primevideo_autoplay: isEnabled });
    updateGlobalButton();
    
    if (isEnabled || primevideoToggle.checked) {
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
