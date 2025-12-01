const globalButton = document.getElementById("global-button");
const hbomaxToggle = document.getElementById("hbomax-toggle");
const hbomaxFavicon = document.getElementById("hbomax-favicon");

async function loadSettings() {
    const result = await chrome.storage.local.get(['global_enabled', 'hbomax_autoplay']);
    
    if (result.global_enabled === false) {
        globalButton.classList.remove('global-button-on');
        globalButton.classList.add('global-button-off');
    } else {
        globalButton.classList.remove('global-button-off');
        globalButton.classList.add('global-button-on');
    }
    
    hbomaxToggle.checked = result.hbomax_autoplay !== false;
    
    const tabs = await chrome.tabs.query({});
    const hbomaxTab = tabs.find(tab => tab.url && tab.url.includes('hbomax.com'));
    if (hbomaxTab && hbomaxTab.favIconUrl) {
        hbomaxFavicon.src = hbomaxTab.favIconUrl;
    }
}

function updateGlobalButton() {
    const anyEnabled = hbomaxToggle.checked;
    
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
        await chrome.storage.local.set({ global_enabled: false, hbomax_autoplay: false });
    } else {
        globalButton.classList.remove('global-button-off');
        globalButton.classList.add('global-button-on');
        hbomaxToggle.checked = true;
        await chrome.storage.local.set({ global_enabled: true, hbomax_autoplay: true });
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

loadSettings();