if (typeof chrome !== 'undefined' && chrome.storage) {

  const globalButton = document.getElementById("global-button");
  const hbomaxToggle = document.getElementById("hbomax-toggle");
  const hbomaxFavicon = document.getElementById("hbomax-favicon");
  const huluToggle = document.getElementById("hulu-toggle");
  const huluFavicon = document.getElementById("hulu-favicon");
  const youtubeToggle = document.getElementById("youtube-toggle");
  const youtubeFavicon = document.getElementById("youtube-favicon");

  async function loadSettings() {
      const result = await chrome.storage.local.get(['global_enabled', 'hbomax_autoplay', 'hulu_autoplay', 'youtube_autoplay']);
      
      hbomaxToggle.checked = result.hbomax_autoplay ?? true;
      huluToggle.checked = result.hulu_autoplay ?? true;
      youtubeToggle.checked = result.youtube_autoplay ?? true;

      updateGlobalButton();
      
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
      globalButton.classList.toggle('global-button-on', anyEnabled);
      globalButton.classList.toggle('global-button-off', !anyEnabled);
  }

  async function handleToggleChange(key, element) {
      const isEnabled = element.checked;
      await chrome.storage.local.set({ [key]: isEnabled });
      updateGlobalButton();
      
      const anyEnabled = hbomaxToggle.checked || huluToggle.checked || youtubeToggle.checked;
      await chrome.storage.local.set({ global_enabled: anyEnabled });
  }

  globalButton.addEventListener('click', async () => {
      const isCurrentlyOn = globalButton.classList.contains('global-button-on');
      const newState = !isCurrentlyOn;
      
      hbomaxToggle.checked = newState;
      huluToggle.checked = newState;
      youtubeToggle.checked = newState;

      await chrome.storage.local.set({ 
          global_enabled: newState, 
          hbomax_autoplay: newState, 
          hulu_autoplay: newState, 
          youtube_autoplay: newState 
      });
      updateGlobalButton();
  });

  hbomaxToggle.addEventListener('change', () => handleToggleChange('hbomax_autoplay', hbomaxToggle));
  huluToggle.addEventListener('change', () => handleToggleChange('hulu_autoplay', huluToggle));
  youtubeToggle.addEventListener('change', () => handleToggleChange('youtube_autoplay', youtubeToggle));

  loadSettings();

}