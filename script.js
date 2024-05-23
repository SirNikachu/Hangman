let selectedWord = '';
let guessedLetters = [];
let tries = 6;

async function fetchWordsFromFile() {
    try {
        const response = await fetch('words_alpha.txt');
        const text = await response.text();
        return text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
    } catch (error) {
        console.error('Error fetching words from file:', error);
        return ['fails'];
    }
}

function displayHangman() {
    const stages = [
        `
           -----
           |   |
           O   |
          /|\\  |
          / \\  |
               |
        ---------
        `,
        `
           -----
           |   |
           O   |
          /|\\  |
          /    |
               |
        ---------
        `,
        `
           -----
           |   |
           O   |
          /|\\  |
               |
               |
        ---------
        `,
        `
           -----
           |   |
           O   |
          /|   |
               |
               |
        ---------
        `,
        `
           -----
           |   |
           O   |
           |   |
               |
               |
        ---------
        `,
        `
           -----
           |   |
           O   |
               |
               |
               |
        ---------
        `,
        `
           -----
           |   |
               |
               |
               |
               |
        ---------
        `
    ];
    document.getElementById('hangman').innerText = stages[tries];
}

function displayWord() {
    const wordDisplay = selectedWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    document.getElementById('word-display').innerText = wordDisplay;
}

function displayMessage(message) {
    document.getElementById('message').innerText = message;
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter) || tries === 0) {
        return;
    }
    guessedLetters.push(letter);
    if (!selectedWord.includes(letter)) {
        tries -= 1;
    }
    updateGame();
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
        const button = document.createElement('button');
        button.innerText = letter;
        button.onclick = () => handleGuess(letter);
        keyboard.appendChild(button);
    });
}

function updateGame() {
    displayHangman();
    displayWord();
    if (tries === 0) {
        displayMessage(`Game over! The word was '${selectedWord}'.`);
    } else if (selectedWord.split('').every(letter => guessedLetters.includes(letter))) {
        displayMessage('Congratulations! You guessed the word!');
    } else {
        displayMessage('');
    }
}

async function startGame() {
    const words = await fetchWordsFromFile();
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    tries = 6;
    displayHangman();
    displayWord();
    createKeyboard();
    displayMessage('');
}

document.addEventListener('DOMContentLoaded', startGame);
