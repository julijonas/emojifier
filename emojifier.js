
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

let imgNode;
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

function convertImage(event) {
    console.log('convertImage')
    popupNode.hidden = true;
    imgNode.dataset.converted = true;
    getFaceData();
}

function getFaceData(){
    fetch('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
        method: 'POST',
        body: JSON.stringify({url: imgNode.src}),
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': apiEmojiKey
        }
    }).then((resp) => resp.json())
    .then((resp) => {
        replaceImage(resp);
    })
    .catch((error) => {
        console.log(error);
    });
}

function replaceImage(faces) {
    console.log('replaceImages', faces)
    for (const {faceRectangle, scores} of faces) {
        console.log(faceRectangle, scores);
        const image = new Image();
        image.src = chrome.extension.getURL(`emojis/${getClosestEmoji(scores)}`);
        const rect = imgNode.getBoundingClientRect();
        console.log(faceRectangle.top)
        console.log(faceRectangle.top * imgNode.naturalHeight / imgNode.height)
        console.log(faceRectangle.top * imgNode.height / imgNode.naturalHeight)
        const top = rect.top + window.scrollY + faceRectangle.top * imgNode.height / imgNode.naturalHeight;
        const left = rect.left + window.scrollX + faceRectangle.left * imgNode.width / imgNode.naturalWidth;
        image.style.position = 'absolute';
        image.style.top = `${top}px`;
        image.style.left = `${left}px`;
        image.style.zIndex = 999999;
        image.style.width = `${faceRectangle.width}px`;
        image.style.height = `${faceRectangle.height}px`;
        image.dataset.converted = true;
        document.body.appendChild(image);

        //const canvas = document.createElement('canvas');
        //const context = canvas.getContext('2d');
        //image.crossOrigin = 'Anonymous';
        //canvas.width = image.width;
        //canvas.height = image.height;
        //context.drawImage(image, 0, 0, image.width, image.height);
        //context.drawImage(imgNode, top, left, width, height);
        //imgNode.src = canvas.toDataURL();
    }
}

function showPopup() {
    console.log('showPopup')
    const rect = imgNode.getBoundingClientRect();
    const top = rect.top + window.scrollY + imgNode.offsetHeight - popupNode.offsetHeight;
    const left = rect.left + window.scrollX + imgNode.offsetWidth - popupNode.offsetWidth;
    popupNode.style.top = `${top}px`;
    popupNode.style.left = `${left}px`;
    popupNode.hidden = false;
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

function hidePopup(event) {
    console.log('hidePopup')
    imgNode = event.target;
    popupNode.hidden = true;
}

popupNode.addEventListener('click', convertImage);
popupTextNode.addEventListener('click', translateText);

document.addEventListener('mouseover', ({target}) => {
    if (target.tagName === 'IMG' && !target.dataset.converted) {
        imgNode = target;
        showPopup();
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
