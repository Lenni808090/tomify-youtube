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
  { top: "5px", left: "5px" },
  { top: "5px", right: "5px" },
  { bottom: "5px", left: "5px" },
  { bottom: "5px", right: "5px" },
];

const styleEl = document.createElement('style');
styleEl.textContent = `
  img.face-overlay {
    position: absolute;
    width: 30%;
    max-height: 80%;
    pointer-events: none;
    border-radius: 12px;
    transition: opacity 0.2s ease-out;
    opacity: 1;
  }
  /* hide overlay on any thumbnail hover */
  ytd-thumbnail:hover > img.face-overlay {
    opacity: 0 !important;
  }
  /* ensure thumbnail container relative positioning */
  ytd-thumbnail {
    position: relative;
  }
`;
document.head.appendChild(styleEl);

function getRandomFace() {
  return faces[Math.floor(Math.random() * faces.length)];
}

function getRandomPosition() {
  return styles[Math.floor(Math.random() * styles.length)];
}

function addOverlay(thumb) {
  const img = document.createElement('img');
  img.src = getRandomFace();
  img.className = 'face-overlay';
  const pos = getRandomPosition();
  Object.assign(img.style, pos);
  thumb.appendChild(img);
}

function prependTitle(container) {
  if (container) {
    const titleEl = container.querySelector('#video-title, yt-formatted-string#video-title');
    if (titleEl && !titleEl.dataset.modified) {
      titleEl.insertAdjacentText('afterbegin', 'Thomas REACTS to ');
      titleEl.dataset.modified = 'true';
    }
  }
}

function overlayFaces() {
  document.querySelectorAll('ytd-thumbnail:not(.ytd-video-preview)').forEach(thumb => {
    
    if (!thumb.querySelector('img.face-overlay')) {
      addOverlay(thumb);
    }

    const container = thumb.closest('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer');
    prependTitle(container);
  });
}

new MutationObserver(mutations => {
  overlayFaces();
}).observe(document.body, { childList: true, subtree: true });

overlayFaces();
