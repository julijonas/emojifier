
document.addEventListener("click", (e) => {

    function emojify(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: "emojify"
        });
    }

    function reset(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: "reset"
        });
    }

    if (e.target.classList.contains("emojify")) {
        chrome.tabs.query({active: true, currentWindow: true}, emojify);
    } else if (e.target.classList.contains("reset")) {
        chrome.tabs.query({active: true, currentWindow: true}, reset);
    }
});
