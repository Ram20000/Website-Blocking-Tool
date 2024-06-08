document.addEventListener('DOMContentLoaded', function() {
  const passwordContainer = document.getElementById('passwordContainer');
  const passwordForm = document.getElementById('passwordForm');
  const passwordInput = document.getElementById('passwordInput');
  const submitPasswordBtn = document.getElementById('submitPasswordBtn');
  const passwordErrorMsg = document.getElementById('passwordErrorMsg');
  const mainContent = document.getElementById('mainContent');
  const setPasswordBtn = document.getElementById('setPasswordBtn');
  const disablePasswordBtn = document.getElementById('disablePasswordBtn');
  const addKeywordBtn = document.getElementById('addKeywordBtn');
  const blockedKeywordsList = document.getElementById('blockedKeywordsList');
  const keywordInput = document.getElementById('keywordInput');
  const removeKeywordBtn = document.getElementById('removeKeywordBtn');
  const startTimeInput = document.getElementById('startTimeInput');
  const endTimeInput = document.getElementById('endTimeInput');
  const setTimeBlockBtn = document.getElementById('setTimeBlockBtn');
  const timeBlockCheckbox = document.getElementById('timeBlockCheckbox');

  // Check if a password is set
  chrome.storage.sync.get("password", function(data) {
    const storedPassword = data.password;
    if (storedPassword) {
      showPasswordPrompt();
    } else {
      showMainContent();
    }
  });

  // Submit password
  passwordForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const enteredPassword = passwordInput.value.trim();
    chrome.storage.sync.get("password", function(data) {
      const storedPassword = data.password;
      if (enteredPassword === storedPassword) {
        showMainContent();
        passwordErrorMsg.textContent = '';
      } else {
        passwordErrorMsg.textContent = 'Incorrect password';
      }
    });
  });

  // Set password
  setPasswordBtn.addEventListener('click', function() {
    const newPassword = prompt("Enter new password:");
    if (newPassword !== null && newPassword !== "") {
      chrome.storage.sync.set({ password: newPassword });
    }
  });

  // Disable password
  disablePasswordBtn.addEventListener('click', function() {
    if (confirm("Are you sure you want to disable the password?")) {
      chrome.storage.sync.remove("password");
      showMainContent();
    }
  });

  // Add keyword
  addKeywordBtn.addEventListener('click', function() {
    const keyword = keywordInput.value.trim();
    if (keyword) {
      chrome.storage.sync.get("blockedKeywords", function(data) {
        let blockedKeywords = data.blockedKeywords || [];
        blockedKeywords.push(keyword);
        chrome.storage.sync.set({ blockedKeywords: blockedKeywords });
        renderBlockedKeywords(blockedKeywords);
        keywordInput.value = '';
      });
    }
  });

  // Remove keyword
  removeKeywordBtn.addEventListener('click', function() {
    const selectedKeyword = blockedKeywordsList.value;
    if (selectedKeyword) {
      chrome.storage.sync.get("blockedKeywords", function(data) {
        let blockedKeywords = data.blockedKeywords || [];
        blockedKeywords = blockedKeywords.filter(keyword => keyword !== selectedKeyword);
        chrome.storage.sync.set({ blockedKeywords: blockedKeywords });
        renderBlockedKeywords(blockedKeywords);
      });
    }
  });

  // Set time block
  setTimeBlockBtn.addEventListener('click', function() {
    const startTime = startTimeInput.value.trim();
    const endTime = endTimeInput.value.trim();

    if (startTime === "" || endTime === "") {
      alert("Please enter both start and end times.");
      return;
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      alert("Please enter valid time in the format HH:MM.");
      return;
    }

    if (isInvalidTimeFrame(startTime, endTime)) {
      alert("Invalid time frame. End time must be later than start time.");
      return;
    }

    chrome.storage.sync.set({
      blockTimeEnabled: timeBlockCheckbox.checked,
      blockStartTime: startTime,
      blockEndTime: endTime
    });
  });

  // Initialize the UI with stored data
  chrome.storage.sync.get(["blockTimeEnabled", "blockStartTime", "blockEndTime"], function(data) {
    const blockTimeEnabled = data.blockTimeEnabled || false;
    const blockStartTime = data.blockStartTime || "00:00";
    const blockEndTime = data.blockEndTime || "00:00";

    timeBlockCheckbox.checked = blockTimeEnabled;
    startTimeInput.value = blockStartTime;
    endTimeInput.value = blockEndTime;
  });

  // Render blocked keywords
  function renderBlockedKeywords(keywords) {
    blockedKeywordsList.innerHTML = '';
    keywords.forEach(keyword => {
      const option = document.createElement('option');
      option.textContent = keyword;
      option.value = keyword;
      blockedKeywordsList.appendChild(option);
    });
  }

  // Show password prompt
  function showPasswordPrompt() {
    passwordContainer.style.display = 'block';
    mainContent.style.display = 'none';
    passwordInput.focus();
  }

  // Show main content
  function showMainContent() {
    passwordContainer.style.display = 'none';
    mainContent.style.display = 'block';
  }

  // Validate time format
  function isValidTime(time) {
    const timeRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
    return timeRegex.test(time);
  }

  // Validate time frame
  function isInvalidTimeFrame(startTime, endTime) {
    const startHour = parseInt(startTime.split(":")[0]);
    const startMinute = parseInt(startTime.split(":")[1]);
    const endHour = parseInt(endTime.split(":")[0]);
    const endMinute = parseInt(endTime.split(":")[1]);

    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      return true;
    }

    return false;
  }
});
