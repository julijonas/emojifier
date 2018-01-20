let apiKey;
browser.storage.local.get('apiKey').then((data) => {
    apiKey = data.apiKey;
    console.log('API key', apiKey);
});

let imgNode;

const popupNode = document.createElement('a');
popupNode.textContent = 'Emojify';
popupNode.style.position = 'absolute';
popupNode.style.background = '#eee';
popupNode.style.padding = '2px';
popupNode.style.cursor = 'pointer';
popupNode.style.textDecoration = 'underline';
document.body.appendChild(popupNode);

function convertImage(event) {
    alert('hahaha');
}

popupNode.addEventListener('click', convertImage);

function showPopup(event) {
    imgNode = event.target;
    let left = imgNode.offsetLeft + imgNode.offsetWidth - popupNode.offsetWidth;
    let top = imgNode.offsetTop + imgNode.offsetHeight - popupNode.offsetHeight;
    popupNode.style.left = `${left}px`;
    popupNode.style.top = `${top}px`;
    popupNode.hidden = false;
    console.log(event);
}

function hidePopup(event) {
    imgNode = event.target;
    popupNode.hidden = true;
    console.log(event);
}

for (const node of document.images) {
    node.addEventListener('mouseover', showPopup);
    //node.addEventListener('mouseout', hidePopup);
}
