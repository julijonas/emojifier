function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    apiKey: document.querySelector("#apiKey").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#apiKey").value = result.apiKey || "";
  }

  var getting = chrome.storage.local.get("apiKey", setCurrentChoice);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
