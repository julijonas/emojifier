function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    apiEmojiKey: document.querySelector("#apiEmojiKey").value
  });
  chrome.storage.local.set({
    apiTextKey: document.querySelector("#apiTextKey").value
  });
}

function restoreOptions() {
    chrome.storage.local.get("apiEmojiKey", ({apiEmojiKey}) => {
        document.querySelector("#apiEmojiKey").value = result.apiEmojiKey || "";
    });
    chrome.storage.local.get("apiTextKey", ({apiTextKey}) => {
        document.querySelector("#apiTextKey").value = result.apiTextKey || "";
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
