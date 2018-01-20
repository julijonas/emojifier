import {emojis} from './tag_emojis'

function getEmotionVector(jsonFile){
    var inputVector = [];
    const emotions = jsonFile[0].scores;
    for (const value of Object.values(emotions)) {
        inputVector.push(value);
    }

    return inputVector;
}

function getClosedEmoji(jsonFile){
    const inputEmotion = getEmotionVector(jsonFile);
    let minDistanceEmotion = Number.POSITIVE_INFINITY;
    let closedEmoji;
    let distanceSquared;

    for (const [fileName,values] of Object.entries(emojis)) {
        distanceSquared = 0;
        for(let i = 0; i < 8; i++){
            distanceSquared += Math.pow(values[i] - inputEmotion[i],2);
        }
        if(Math.sqrt(distanceSquared) < minDistanceEmotion){
            closedEmoji = fileName;
            minDistanceEmotion = Math.sqrt(distanceSquared);
        }
    }

    return closedEmoji;
}
