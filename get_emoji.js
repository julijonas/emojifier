const emojis = {	
    "001-embarrassed-4.png": [0, 0, 0, 0.3, 0.4, 0, 0, 0.3],
    "002-sad-14.png": [0.2, 0.1, 0.1, 0.1, 0, 0, 0.5, 0],
    "004-surprised-1.png": [0, 0, 0, 0.2, 0, 0, 0, 0.8],
    "006-laughing-3.png": [0, 0.4, 0, 0, 0.6, 0, 0, 0],
    "009-surprised.png": [0, 0, 0, 0.2, 0.2, 0, 0, 0.6],
    "011-suspicious.png": [0, 0.2, 0.05, 0.05, 0, 0.4, 0, 3],
    "015-laughing-2.png": [0, 0, 0, 0, 0.99, 0.01, 0, 0],
    "019-happy-4.png": [0, 0, 0, 0.1, 0.98, 0, 0, 0.1],
    "032-happy-5.png": [0, 0, 0, 0, 0.9, 0.099, 0, 0.001],
    "033-sad-13.png": [0.2, 0, 0, 0.1, 0, 0.2, 0.5, 0],
    "044-muted.png": [0, 0, 0, 0, 0, 1, 0, 0],
    "045-shocked-6.png": [0, 0, 0.1, 0, 0, 0.5, 0.1, 0.3],
    "047-embarrassed-3.png": [0.2, 0, 0.1, 0.6, 0, 0, 0, 0.1],
    "048-shocked-5.png": [0, 0, 0, 0.2, 0, 0, 0, 0.8],
    "049-shocked-4.png": [0, 0, 0, 0, 0, 0, 0, 1],
    "050-embarrassed-2.png": [0, 0, 0, 0.5, 0, 0, 0.5, 0],
    "053-crying-2.png": [0, 0, 0, 0, 0, 0, 1, 0],
    "055-sad-12.png": [0.1, 0.1, 0, 0.6, 0, 0, 0.2, 0],
    "056-sad-11.png": [0, 0.1, 0, 0.1, 0, 0.05, 0.75, 0],
    "060-sad-7.png": [0, 0, 0.1, 0.1, 0, 0, 0.8, 0],
    "061-sad-6.png": [0, 0, 0, 0, 0.15, 0, 0.85, 0],
    "070-tongue-2.png": [0, 0, 0, 0.1, 0.3, 0, 0, 0.6],
    "062-angry-3.png": [0.9, 0.1, 0, 0, 0, 0, 0, 0],
    "065-angry-2.png": [1, 0, 0, 0, 0, 0, 0, 0],
    "066-angry-1.png": [0.8, 0.2, 0, 0, 0, 0, 0, 0],
    "080-angry.png": [0.5, 0, 0, 0, 0, 0.5, 0, 0],
    "104-ghost.png": [0.11, 0, 0.1, 0.61, 0, 0, 0, 0.18],
    "098-happy.png": [0, 0, 0, 0, 95, 0.01, 0, 0.04],
    "097-happy-1.png": [0, 0, 0, 0, 0.96, 0.01, 0, 0.03],
    "096-crying.png": [0, 0, 0, 0, 1, 0, 0, 0],
    "086-happy-4.png": [0.1, 0, 0.1, 0, 0.6, 0.11, 0.05, 0.04],
    "083-smart.png": [0, 0.2, 0.1, 0, 0.2, 0.3, 0, 0.2],
    "081-sleeping.png": [0.05, 0.05, 0.1, 0.1, 0, 0.75, 0.5, 0]
};

function getEmotionVector(emotions){
    let inputVector = [];
    for (const value of Object.values(emotions)) {
        inputVector.push(value);
    }

    return inputVector;
}

function getClosestEmoji(scores){
    const inputEmotion = getEmotionVector(scores);
    let minDistanceEmotion = Number.POSITIVE_INFINITY;
    let closestEmoji;
    let distanceSquared;

    for (const [fileName,values] of Object.entries(emojis)) {
        distanceSquared = 0;
        for(let i = 0; i < 8; i++){
            distanceSquared += Math.pow(values[i] - inputEmotion[i],2);
        }
        if(Math.sqrt(distanceSquared) < minDistanceEmotion){
            closestEmoji = fileName;
            minDistanceEmotion = Math.sqrt(distanceSquared);
        }
    }

    return closestEmoji;
}
