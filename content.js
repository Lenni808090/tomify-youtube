const faces = [
  "https://i.imgur.com/9lzD2Ug.jpeg",
  "https://i.imgur.com/MskWHJO.jpeg",
  "https://i.imgur.com/VQtLloc.jpeg",
  "https://i.imgur.com/z9ScoeD.jpeg",
  "https://i.imgur.com/Hh7W2Ha.jpeg",
  "https://i.imgur.com/VTn6fgr.jpeg",
  "https://i.imgur.com/7SGt4tY.jpeg",
  "https://i.imgur.com/nKjq7MK.jpeg",
  "https://i.imgur.com/v7aEGSX.jpeg",
  "https://i.imgur.com/Hu9ZNBR.jpeg",
  "https://i.imgur.com/wBuVRkr.jpeg",
  "https://i.imgur.com/Ulj00Lm.jpeg",
  "https://i.imgur.com/igzuIp2.jpeg",
];

const styles = [
  {
    position: "absolute",
    width: "30%",
    maxHeight: `80%`,
    top: "5px",
    left: "5px",
    zIndex: "10",
    pointerEvents: "none",
    borderRadius: `12px`,
  },
  {
    position: "absolute",
    width: "30%",
    maxHeight: `80%`,
    top: "5px",
    right: "5px",
    zIndex: "10",
    pointerEvents: "none",
    borderRadius: `12px`,
  },
  {
    position: "absolute",
    width: "30%",
    maxHeight: `80%`,
    bottom: "5px",
    left: "5px",
    zIndex: "10",
    pointerEvents: "none",
    borderRadius: `12px`,
  },
  {
    position: "absolute",
    width: "30%",
    maxHeight: `80%`,
    bottom: "5px",
    right: "5px",
    zIndex: "10",
    pointerEvents: "none",
    borderRadius: `12px`,
  },
];

let titleChange;
let faceOverlay;

// Add custom CSS to handle hover effects
const styleElement = document.createElement('style');
styleElement.textContent = `
  /* Base style for face overlays */
  .face-overlay {
    transition: opacity 0.2s ease-out;
    opacity: 1;
  }
  
  /* Hide face overlays when preview is showing */
  ytd-thumbnail.ytd-video-preview .face-overlay,
  ytd-thumbnail:hover .face-overlay {
    opacity: 0 !important;
  }
`;
document.head.appendChild(styleElement);

// Safely get Chrome storage - using try/catch to prevent errors
try {
  chrome.storage.sync.get(["faceOverlay", "titleChange"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Chrome storage error:", chrome.runtime.lastError);
      // Set defaults if there's an error
      faceOverlay = false;
      titleChange = false;
    } else {
      faceOverlay = result.faceOverlay ?? false;
      titleChange = result.titleChange ?? false;
    }
    // Apply overlays after getting settings
    overlayFaces();
  });
} catch (e) {
  console.error("Error accessing Chrome storage:", e);
  // Set defaults if there's an exception
  faceOverlay = false;
  titleChange = false;
  overlayFaces();
}

// Safely handle runtime messages - using try/catch to prevent errors
try {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "TOGGLE_VALUES") {
      titleChange = message.titleChange;
      faceOverlay = message.faceOverlay;
      overlayFaces();
    }
  });
} catch (e) {
  console.error("Error setting up message listener:", e);
}

function getRandomFace() {
  return faces[Math.floor(Math.random() * faces.length)];
}

function getRandomPosition() {
  return styles[Math.floor(Math.random() * styles.length)];
}

function overlayFaces() {
  document.querySelectorAll("ytd-thumbnail").forEach((thumbnail) => {
    let existingOverlay = thumbnail.querySelector(".face-overlay");
    
    // Remove overlay if disabled
    if (!faceOverlay && existingOverlay) {
      existingOverlay.remove();
    }
    
    // Add overlay if enabled and not already present
    if (faceOverlay && !existingOverlay) {
      const overlay = document.createElement("img");
      overlay.src = getRandomFace();
      overlay.className = "face-overlay";
      Object.assign(overlay.style, getRandomPosition());
      thumbnail.appendChild(overlay);
    }
    
    // Process title changes
    const renderer = thumbnail.closest(
      "ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer"
    );
    
    const titleEl =
      renderer?.querySelector("#video-title") ||
      renderer?.querySelector("yt-formatted-string#video-title");
    
    if (titleEl) {
      if (!titleEl.dataset.modified && titleChange) {
        titleEl.dataset.original = titleEl.textContent;
        titleEl.textContent = `Thomas REACTS to ${titleEl.dataset.original}`;
        titleEl.setAttribute("title", titleEl.textContent);
        titleEl.dataset.modified = "true";
      }
      
      if (titleEl.dataset.modified && !titleChange) {
        titleEl.textContent = `${titleEl.dataset.original}`;
        titleEl.setAttribute("title", titleEl.textContent);
        titleEl.removeAttribute("data-modified");
        titleEl.removeAttribute("data-original");
      }
    }
  });
}

// Initial overlay application
overlayFaces();

// Monitor for YouTube's dynamic content loading
const observer = new MutationObserver((mutations) => {
  let needsUpdate = false;
  
  mutations.forEach(mutation => {
    // Check if new nodes were added that might contain thumbnails
    if (mutation.addedNodes && mutation.addedNodes.length) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];
        // Check if this node is a thumbnail or contains thumbnails
        if (node.nodeType === 1 && 
            (node.matches?.('ytd-thumbnail') || 
             node.querySelector?.('ytd-thumbnail'))) {
          needsUpdate = true;
          break;
        }
      }
    }
  });
  
  if (needsUpdate) {
    overlayFaces();
  }
});

// Start observing with a configuration that watches for changes to the DOM tree
observer.observe(document.body, {
  childList: true,
  subtree: true,
});