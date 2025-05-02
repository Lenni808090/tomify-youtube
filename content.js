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

function getRandomFace() {
  return faces[Math.floor(Math.random() * faces.length)];
}

function getRandomPosition() {
    return styles[Math.floor(Math.random() * styles.length)]
}

function overlayFaces() {
  document.querySelectorAll("ytd-thumbnail").forEach((thumbnail) => {
    if (thumbnail.querySelector(".face-overlay")) return;

    const overlay = document.createElement("img");
    overlay.src = getRandomFace();
    overlay.className = "face-overlay";

    Object.assign(overlay.style, getRandomPosition());

    thumbnail.style.position = "relative";
    thumbnail.appendChild(overlay);

    const renderer = thumbnail.closest(
      "ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer"
    );

    const titleEl =
      renderer?.querySelector("#video-title") ||
      renderer?.querySelector("yt-formatted-string#video-title");

    if (titleEl && !titleEl.dataset.modified) {
      const original = titleEl.textContent.trim();
      titleEl.textContent = `Thomas REACTS to ${original}`;
      titleEl.setAttribute("title", titleEl.textContent);
      titleEl.dataset.modified = "true";
    }

    overlay.onerror = () => overlay.remove();
  });
}

overlayFaces();

const observer = new MutationObserver(overlayFaces);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
