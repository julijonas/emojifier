let apiKey;
chrome.storage.local.get('apiKey', (data) => {
    apiKey = data.apiKey;
});

let imgNode;

const popupNode = document.createElement('a');
popupNode.textContent = 'Emojify';
popupNode.style.position = 'absolute';
popupNode.style.background = '#d1d800';
popupNode.style.padding = '4px 6px';
popupNode.style.cursor = 'pointer';
popupNode.style.textDecoration = 'underline';
popupNode.hidden = true;
document.body.appendChild(popupNode);

function convertImage(event) {
    console.log('convertImage')
    popupNode.hidden = true;
    imgNode.dataset.coverted = true;
    getFaceData();
}

function getFaceData(){
    fetch('https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
        method: 'POST',
        body: JSON.stringify({url: imgNode.src}),
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': apiKey
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

function hidePopup(event) {
    console.log('hidePopup')
    imgNode = event.target;
    popupNode.hidden = true;
}

popupNode.addEventListener('click', convertImage);

for (const node of document.images) {
    node.addEventListener('mouseover', showPopup);
    //node.addEventListener('mouseout', hidePopup);
}

