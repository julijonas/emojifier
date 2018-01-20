function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    apiKey: document.querySelector("#apiKey").value
  });
}

function restoreOptions() {
    chrome.storage.local.get("apiKey", ({apiKey}) => {
        document.querySelector("#apiKey").value = result.apiKey || "";
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
