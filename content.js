chrome.storage.sync.get(["blockedKeywords", "blockTimeEnabled", "blockStartTime", "blockEndTime"], function(data) {
  let blockedKeywords = data.blockedKeywords || [];
  let blockTimeEnabled = data.blockTimeEnabled || false;
  let blockStartTime = data.blockStartTime || "00:00";
  let blockEndTime = data.blockEndTime || "00:00";

  if (blockTimeEnabled) {
    const now = new Date();
    const currentTime = now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

    const startTime = new Date();
    startTime.setHours(parseInt(blockStartTime.split(":")[0]));
    startTime.setMinutes(parseInt(blockStartTime.split(":")[1]));

    const endTime = new Date();
    endTime.setHours(parseInt(blockEndTime.split(":")[0]));
    endTime.setMinutes(parseInt(blockEndTime.split(":")[1]));

    if (now >= startTime && now <= endTime) {
      blockWebsite();
    }
  } else {
    blockWebsite();
  }

  function blockWebsite() {
    if (blockedKeywords.length > 0) {
      const url = window.location.href.toLowerCase();
      const found = blockedKeywords.some(keyword => url.includes(keyword.toLowerCase()));

      if (found) {
        displayBlockedMessage(); // Display custom message
      }
    }
  }

  function displayBlockedMessage() {
    // Apply z-index to the entire document to ensure the message covers all elements
    document.documentElement.style.position = "relative";
    document.documentElement.style.zIndex = "9999";

    // Create overlay div
    const overlay = document.createElement('div');
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(128, 128, 128, 1)"; // Semi-transparent gray background
    overlay.style.zIndex = "9999";

    // Create message div
    const message = document.createElement('div');
    message.textContent = "This website is blocked.";
    message.style.position = "absolute";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.color = "#fff";
    message.style.fontFamily = "Arial, sans-serif";
    message.style.fontSize = "24px";
    message.style.zIndex = "10000"; // Ensure the message is on top of the overlay

    // Append message div to overlay
    overlay.appendChild(message);

    // Append overlay to body
    document.body.appendChild(overlay);
  }
});
