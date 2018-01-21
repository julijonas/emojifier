
let apiEmojiKey;
let apiTextKey;
chrome.storage.local.get('apiEmojiKey', (data) => {
    apiEmojiKey = data.apiEmojiKey;
    console.log('Emoji API key: ', apiEmojiKey);
});
chrome.storage.local.get('apiTextKey', (data) => {
    apiTextKey = data.apiTextKey;
    console.log('Text API key: ', apiTextKey);

});

let selectedText;

const popupNode = document.createElement('a');
popupNode.textContent = 'Emojify';
popupNode.style.position = 'absolute';
popupNode.style.background = '#d1d800';
popupNode.style.padding = '4px 6px';
popupNode.style.cursor = 'pointer';
popupNode.style.textDecoration = 'underline';
popupNode.style.zIndex = 999999;
popupNode.hidden = true;
document.body.appendChild(popupNode);

const popupTextNode = document.createElement('a');
popupTextNode.textContent = 'Translate';
popupTextNode.style.position = 'absolute';
popupTextNode.style.background = '#58d68d ';
popupTextNode.style.padding = '2px 3px';
popupTextNode.style.cursor = 'pointer';
popupTextNode.style.textDecoration = 'underline';
popupTextNode.hidden = true;
document.body.appendChild(popupTextNode);

const emojiParent = document.createElement('div');
document.body.appendChild(emojiParent);

function findAndAddEmojis(imgNode) {
    popupNode.hidden = true;
    imgNode.classList.add('emojifierConverted');

    fetch('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
        method: 'POST',
        body: JSON.stringify({url: imgNode.src}),
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': apiEmojiKey
        }
    }).then((resp) => {
        if (resp.ok) {
            return resp.json();
        } else {
            console.error('Response error', resp);
        }
    })
    .then((resp) => {
        addEmojis(imgNode, resp);
    })
    .catch((error) => {
        console.log(error);
    });
}

function addEmojis(imgNode, faces) {
    for (const {faceRectangle, scores} of faces) {
        const image = new Image();
        image.src = chrome.extension.getURL(`emojis/${getClosestEmoji(scores)}`);
        const rect = imgNode.getBoundingClientRect();
        const ratioX = imgNode.scrollWidth / imgNode.dataset.naturalWidth;
        const ratioY = imgNode.scrollHeight / imgNode.dataset.naturalHeight;
        const left = rect.left + window.scrollX + faceRectangle.left * ratioX;
        const top = rect.top + window.scrollY + faceRectangle.top * ratioY;
        const width = faceRectangle.width * ratioX;
        const height = faceRectangle.height * ratioY;
        image.style.position = 'absolute';
        image.style.top = `${top}px`;
        image.style.left = `${left}px`;
        image.style.zIndex = 999999;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        image.classList.add('emojifierEmoji');
        emojiParent.appendChild(image);
    }
}

function showPopup(imgNode) {
    popupNode.hidden = false;
    const rect = imgNode.getBoundingClientRect();
    const top = rect.top + window.scrollY + imgNode.offsetHeight - popupNode.offsetHeight;
    const left = rect.left + window.scrollX + imgNode.offsetWidth - popupNode.offsetWidth;
    popupNode.style.top = `${top}px`;
    popupNode.style.left = `${left}px`;
}

function showTextPopup(event) {
    let textArea = event.target;
    console.log('TextArea: ', textArea);
    let left = textArea.offsetLeft + textArea.offsetWidth - popupTextNode.offsetWidth;
    let top = textArea.offsetTop + textArea.offsetHeight - popupTextNode.offsetHeight;
    popupTextNode.style.left = `${left}px`;
    popupTextNode.style.top = `${top}px`;
    popupTextNode.hidden = false;
}

function translateText(event) {
    popupTextNode.hidden = true;
    fetch('https://api.microsofttranslator.com/V2/Http.svc/Translate', {method: 'POST',
        body: JSON.stringify({text: selectedText, from: 'en', to: 'lt'}),
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': apiTextKey
        }
    })
    .then((resp) => {
        console.log(resp);
    })
    .catch((error) => {
        console.log(error);
    });
    alert("Got selected text:   " + selectedText);
}

popupNode.addEventListener('click', () => findAndAddEmojis(currentImage));
popupTextNode.addEventListener('click', translateText);

document.addEventListener('mouseover', ({target}) => {
    if (isValidImage(target)) {
        currentImage = target;
        showPopup(target);
    }
});

function isValidImage(image) {
    if (image.tagName !== 'IMG' && !image.style.backgroundImage) {
        return false;
    }

    if (image.classList.contains('emojifierConverted') ||
        image.classList.contains('emojifierEmoji')) {
        return false;
    }

    let url;
    if (image.tagName === 'IMG') {
        url = image.src;
    } else {
        url = image.style.backgroundImage;
    }

    if (url.startsWith('data:')) {
        return false;
    }

    let naturalWidth, naturalHeight;
    if (image.tagName === 'IMG') {
        image.dataset.naturalWidth = image.naturalWidth;
        image.dataset.naturalHeight = image.naturalHeight;
    } else {
        const testImage = new Image();
        testImage.src = image.style.backgroundImage;
        image.dataset.naturalWidth = testImage.width;
        image.dataset.naturalHeight = testImage.height;
    }

    return image.dataset.naturalWidth >= 36 && image.dataset.naturalHeight >= 36;
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.command === "emojify") {
        let i = 0;
        for (const image of document.images) {
            if (isValidImage(image)) {
                setTimeout(() => findAndAddEmojis(image), 100 * i);
                ++i;
            }
        }
    } else if (message.command === "reset") {
        emojiParent.innerHTML = '';
        for (const image of document.getElementsByClassName('emojifierConverted')) {
            image.classList.remove('emojifierConverted');
        }
    }
});

document.onmouseup = checkSelectedText;

function checkSelectedText() {
    let text = getSelectedText();
    if (text) {
        selectedText = text;
        showTextPopup(event);
    }
}

function getSelectedText() {
    let text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}
