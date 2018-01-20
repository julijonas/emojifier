function saveOptions(e) {
  e.preventDefault();
  console.log(document)
  browser.storage.local.set({
    apiKey: document.querySelector("#apiKey").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#apiKey").value = result.apiKey || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("apiKey");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
