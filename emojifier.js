let apiKey;
chrome.storage.local.get('apiKey', (data) => {
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

function getFaceData(img){
    console.log(img);
    let imgUrl = img.src;
    console.log('IMG_URL:', imgUrl);
    const requestUrl = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?';
    let data = {
        url: imgUrl
    };

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Ocp-Apim-Subscription-Key', 'add_key');

    let fetchData = {
        method: 'POST',
        body: JSON.stringify(data), 
        headers: myHeaders
    };

    fetch(requestUrl, fetchData)
      .then((resp) => resp.json())
      .then(function(resp) {
        // Here you get the data to modify as you please
        if (resp.length > 0) {
            console.log(resp);
        } else {
            console.log('No face detected');
        }
        
        })
      
      .catch(function(error) {
        // If there is any error you will catch them here
        console.log(error);
      });
}

function showPopup(event) {
    imgNode = event.target;
    let left = imgNode.offsetLeft + imgNode.offsetWidth - popupNode.offsetWidth;
    let top = imgNode.offsetTop + imgNode.offsetHeight - popupNode.offsetHeight;
    popupNode.style.left = `${left}px`;
    popupNode.style.top = `${top}px`;
    popupNode.hidden = false;
    getFaceData(event.target);
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

