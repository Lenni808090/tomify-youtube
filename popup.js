document.addEventListener('DOMContentLoaded', async () => {
  const toggle1 = document.getElementById('toggle1');
  const toggle2 = document.getElementById('toggle2');

 
  chrome.storage.sync.get(['faceOverlay', 'titleChange'], (result) => {
    if (!toggle1 || !toggle2) return;
    toggle1.checked = result.faceOverlay ?? false;
    toggle2.checked = result.titleChange ?? false;
    sendTogglesToContent();
  });

  const sendTogglesToContent = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.includes("youtube.com")) {
      console.warn("Not a YouTube tab");
      return;
    }
    
    chrome.storage.sync.set({
      faceOverlay: toggle1.checked,
      titleChange: toggle2.checked
    });

    chrome.tabs.sendMessage(tab.id, {
      type: 'TOGGLE_VALUES',
      faceOverlay: toggle1.checked,
      titleChange: toggle2.checked
    });
  };

  toggle1.addEventListener('change', sendTogglesToContent);
  toggle2.addEventListener('change', sendTogglesToContent);
});
