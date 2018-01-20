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
    imgNode.dataset.coverted = true;
    getFaceData();
}

function getFaceData(){
    fetch('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {method: 'POST',
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
    for (const {faceRectangle, scores} of faces) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = imgNode.width;
        canvas.height = imgNode.height;
        context.drawImage(image, 0, 0, image.width, image.height);
        imgNode.src = canvas.toDataURL();
    }
}

function showPopup({target}) {
    console.log('showPopup')
    imgNode = target;
    if (imgNode.dataset.coverted) {
        return;
    }
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

for (const node of document.images) {
    node.addEventListener('mouseover', showPopup);
    //node.addEventListener('mouseout', hidePopup);
}

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
