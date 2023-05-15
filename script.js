const letters = document.querySelectorAll(".letters");
let letterCount = 0;
let currentGuess = "";
let guessCountStart = -1;
let guessCount = 1;
let gameOngoing = true;
let randomWord;
const randomWordAPI = "https://words.dev-apis.com/word-of-the-day";
const wordValidationAPI = "https://words.dev-apis.com/validate-word";
let validWord;
let error = false;

getRandomWord();

document.addEventListener('keydown',function(event){
    if (gameOngoing == false){
        event.preventDefault;
        return;
    }
    if (event.keyCode >= 65 && event.keyCode <= 90){
        if (currentGuess.length < 5){
            letters[letterCount].textContent = event.key;
            currentGuess += event.key;
            letterCount++;
        }

    }
    else if (event.key == "Backspace"){
        // allow user to delete characters
        if (letterCount === guessCountStart+1){
            return;
        }
        else{
            currentGuess = currentGuess.substring(0, currentGuess.length - 1);
            letterCount -= 1;
            letters[letterCount].textContent = "";
        }
    }
    else if (event.key == "Enter" && currentGuess.length == 5){
        checkValidWord(currentGuess).then((validWord) => {
            if (validWord == false){
                blinkRed(currentGuess);
                return;
            }
            else if (guessCount == 5){
                if (checkAnswer(currentGuess) === false){
                    alert(`You lose! The word was ${randomWord}`)
                    gameOngoing = false;
                }
            }
            else if (checkAnswer(currentGuess) === true){
                alert("You win!")
                gameOngoing = false;
            }
            else{
                guessCountStart += 5;
                guessCount += 1;
                currentGuess = "";
            }
        });
    }
    else{
        // do nothing
        return;
    }
})

function checkAnswer(guess){
    // compare each letter space by space
    // check if guess is a valid word
    let win = false;
    
    for (let i = 0; i < guess.length; i++){
        letters[i+guessCountStart+1].style.backgroundColor = "gray";
    }
    if (guess === randomWord){
        for (let i = 0; i < guess.length; i++){
            letters[i+guessCountStart+1].style.backgroundColor = "green";
        }
        win = true;
        return win;
    }
    let randomWordLetterWrongSpace = [];

    for (let i = 0; i < guess.length; i++){
        if (guess[i] === randomWord[i]){
            // for letters that is in the right space, give it a green colour
            letters[i+guessCountStart+1].style.backgroundColor = "green";
            randomWordLetterWrongSpace.push(i);
        }
    }
    for (let i = 0; i < guess.length; i++){
        for (let j = 0; j < randomWord.length; j++){
            if (randomWordLetterWrongSpace.includes(j)){
                continue;
            }
            if (guess[i] === randomWord[j]){
                // for letters that is not in the right space but is in other spaces, give it a orange colour
                randomWordLetterWrongSpace.push(j);
                letters[i+guessCountStart+1].style.backgroundColor = "orange";
            }
        }
    }
    return win;
}

async function checkValidWord(userGuess) {
    const promise = await fetch(wordValidationAPI, {
        method: "POST",
        body: JSON.stringify({"word":userGuess})
    });
    const processedResponse = await promise.json();
    validWord = processedResponse.validWord;
    return validWord;
}

async function getRandomWord(){
    const promise = await fetch(randomWordAPI);
    const processedResponse = await promise.json();
    randomWord = processedResponse.word;
}

function blinkRed(guess) {
    let originalBorderColor = letters[0].style.borderColor;
    for (let i = 0; i < guess.length; i++){
        letters[i+guessCountStart+1].style.borderColor = "red";
    }
    setTimeout(function() {
        for (let i = 0; i < guess.length; i++){
            letters[i+guessCountStart+1].style.borderColor = originalBorderColor;
        }
    }, 500);
}
