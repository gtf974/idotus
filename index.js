// CONST DOM ELEMENTS
const gameBox = document.getElementById("game-box");
const inputBox = document.getElementById("input-box");
const userInput = document.getElementById("input");
const popUp = document.getElementById("myPopup");
const submitButton =  document.getElementById("submit-button");
const wrongBox = document.getElementById("wrong-letter-box");
const wrongLettersBox = document.getElementById("wrong-letters");
const defaultGrid = `
<div data-index=1 class="word-box">  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>
</div>
<div data-index=2 class="word-box">  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>
</div>
<div data-index=3 class="word-box">  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>
</div>
    <div data-index=4 class="word-box">  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>
</div>
<div data-index=5 class="word-box">  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>
</div>
    <div data-index=6 class="word-box">  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>  
    <div class="letter"></div>
</div>`;

// EVENTS
submitButton.addEventListener("click", () => {
    addWord(input.value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
});
submitButton.addEventListener("mouseleave", () => {
    popUp.classList.remove("show");
});

// VARIABLES THAT EVOLVE
let wordsList = [];
let wordToGuess = "GAGNER";
let wrongLetters = [];
let occurences = {};
let gameIndex = 1;
let gameLoop = true;
let isWin = false;
let colors = [];


//-----------------------------------------ALL METHODS---------------------------------------------


//METHOD:
// args: None
// return: None
// def: add the input when enter is pressed
const enterSubmit = (event) => {
    if(event.keyCode == 13){
        addWord(input.value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        setTimeout(() => {
            popUp.classList.remove("show");
        }, 2000);
    }
}
document.addEventListener("keypress", enterSubmit);




//METHOD:
// args: None
// return: None
// def: shows the error popup
const showPopUp = () => {
    if(!(popUp.classList.contains("show"))) document.getElementById("myPopup").classList.add("show");
}




//METHOD:
// args: None
// return: None
// def: gets a random words from a web hosted json and stores it into a wordToGuess
const getTheRandomWord = async () => {
    fetch("https://api.jsonbin.io/v3/b/62019fa769b72261be53fc13", {
        method: 'GET'
    }).then((res) => {
        res.json().then((data) => {
            wordToGuess = data.record.words[Math.floor(Math.random() * 277)].toUpperCase();
        });
    });
}




//METHOD:
// args: None
// return: None
// def: fills the grid into its default state and replaces the first letters by the first letter of wordToGuess
const firstLoad = () => {
    inputBox.style.visibility = "visible";
    wrongBox.style.visibility = "visible";
    gameBox.innerHTML = defaultGrid;
    const wordsBoxes = document.querySelectorAll(".word-box");
    wordsBoxes.forEach((word) => {
        if (word.dataset.index == 1) {
            [...(word.children)].forEach((child) => child.textContent = "_");
        }
        word.firstElementChild.textContent = wordToGuess[0].toUpperCase();
    });
}




//METHOD:
// args: None
// return: None
// def: check the state of the game
const isFinished = (input) => {
    if (input == wordToGuess){
        gameLoop = false;
        isWin = true;
        mainApp();
    }
    if (gameIndex == 7 && input != wordToGuess){
        gameLoop = false;
        isWin = false;
        mainApp();
    }
}




//METHOD:
// args: None
// return: None
// def: disables inputs while processing the word
const disableInputs = () => {
    userInput.readOnly = true;
    submitButton.disabled = true;
    document.removeEventListener("keypress", enterSubmit); //enterSubmit() L.85
}




//METHOD:
// args: None
// return: None
// def: disables inputs while processing the word
const enableInputs = () => {
    userInput.readOnly = false;
    submitButton.disabled = false;
    document.addEventListener("keypress", enterSubmit); //enterSubmit() L.85
    userInput.focus();
}




//METHOD:
// args: None
// return: None
// def: resets game data for a win state
const winReset = () => {
    gameIndex = 1;
    gameLoop = true;
    isWin = false;
    wrongLetters = [];
    wrongLettersBox.innerHTML = "";
    userInput.value = "";
    inputBox.style.visibility = "visible";
    wrongBox.style.visibility = "visible";
    document.getElementById("reset-button").removeEventListener("click", winReset); 
    mainApp();
}




//METHOD:
// args: None
// return: None
// def: resets game data for a loss state
const lossReset = () => {
    gameIndex = 1;
    gameLoop = true;
    isWin = false;
    wrongLetters = [];
    wrongLettersBox.innerHTML = "";
    userInput.value = "";
    inputBox.style.visibility = "visible";
    wrongBox.style.visibility = "visible";
    document.getElementById("reset-button").removeEventListener("click", lossReset);
    mainApp();
}




//METHOD:
// args: None
// return: None
// def: displays the loading page
const loadingPage = () => {
    gameBox.innerHTML = `            
<div data-index=1 class="word-box">  
    <div class="letter">I</div>  
    <div class="letter">D</div>  
    <div class="letter">O</div>  
    <div class="letter">T</div>  
    <div class="letter">U</div>  
    <div class="letter">S</div>
</div>
<div class="result">
    Chargement...
</div>`;
}




//METHOD:
// args: None
// return: None
// def: displays the loading page
const addBadLetter = (letter) => {
    let box = document.createElement('div');
	box.innerHTML = letter;
	box.classList.add('wrong-letter', 'animated');
    document.getElementById("wrong-letters").appendChild(box);
}




//METHOD:
// args: input<string>
// return: None
// def: displays the user input
const generateOccurences = () => {
    for (let i = 0; i < wordToGuess.length; i++) {
        const regex = new RegExp(wordToGuess[i], "g");
        occurences[wordToGuess[i]] = (wordToGuess.match(regex) || []).length;
    }
}




//METHOD:
// args: input<string>
// return: None
// def: displays the user input
const addWord = (input) => {
    //--------THE INPUT LENGTH ISNT 6-----------
    if(input.length != 6){
        popUp.textContent = "Le mot doit contenir 6 lettres.";
        showPopUp(); //L.102
        userInput.value = "";
        return;
    }
    disableInputs(); //L.170
    generateOccurences(); //L.273
    const wordBoxes = document.querySelectorAll(".word-box");
    wordBoxes.forEach((word) => {
        if(word.dataset.index == gameIndex){
            const wordArray = [...(word.children)];
            //-------------RED LETTERS LOOP-------------
            for (let index = 0; index < wordArray.length; index++) {
                if(wordToGuess[index] == input[index]){
                    colors[index] = "red";
                    occurences[input[index]]--;
                } 
            }
            //-------------YELLOW LETTERS LOOP-------------
            for (let index = 0; index < wordArray.length; index++) {
                if (wordToGuess[index] != input[index] && wordToGuess.includes(input[index]) && occurences[input[index]] > 0){
                    colors[index] = "yellow";
                    occurences[input[index]]--;
                }
            }
            //-------------DISPLAY LETTERS LOOP-------------
            for (let index = 0; index < wordArray.length; index++) {
                setTimeout(() => {
                    wordArray[index].textContent = input[index];
                    wordBoxes.forEach((word) => {
                        const allWordsArray = [...(word.children)];
                        for (let index = 0; index < allWordsArray.length; index++) {
                            if(colors[index] && colors[index] == "red" && index > gameIndex){
                                allWordsArray[index].textContent = input[index];
                                allWordsArray[index].classList.add(colors[index]);
                            }
                        }
                    })
                    if(colors[index]) wordArray[index].classList.add(colors[index]);
                    if(!(wordToGuess.includes(input[index])) && !(wrongLetters.includes(input[index]))){
                        wrongLetters.push(input[index]);
                        addBadLetter(input[index]); //L.259
                    }
                }, index*500);
            }
        }
    });
    userInput.value = "";
    gameIndex++;
    setTimeout(() => {
        colors = [];
        isFinished(input); //L.150
        enableInputs(); //L.183
    }, 3032);
}




//----------------------------------------------------------------------------THE APP METHOD-----------------------------------------------------------------------------------

const mainApp = () => {
    loadingPage(); //L.237

    if(gameLoop){
        getTheRandomWord(); //L.113
        setTimeout(() => {
            firstLoad(); //L.130
        }, 3000);
    } else {
        if (isWin){
            inputBox.style.visibility = "hidden";
            wrongBox.style.visibility = "hidden";
            gameBox.innerHTML = `
            <div class="result">
                Bravo! Vous avez réussi en ${gameIndex-1} essai${gameIndex>2 ? "s" : ""}.
            </div>
            <button id="reset-button">Recommencer</div>
            `;
            document.getElementById("reset-button").addEventListener("click", winReset); //winReset() L.197
        } else {
            inputBox.style.visibility = "hidden";
            wrongBox.style.visibility = "hidden";
            gameBox.innerHTML = `
            <div class="result">
                Dommage! Le mot était ${wordToGuess.toUpperCase()}.
            </div>
            <button id="reset-button">Recommencer</div>
            `;
            document.getElementById("reset-button").addEventListener("click", lossReset); //winReset() L.217
        }
    }
}

mainApp(); //This is where all begins. :)