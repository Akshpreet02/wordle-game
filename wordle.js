//==== constants ==============
const URL = "https://api.masoudkf.com/v1/wordle";
const API_KEY = "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv";
let api_data = [{}];

//=============== html Elements =====================
const wordContainer = document.querySelector(".words-container");
const eachWordInput = document.querySelectorAll("#word");
const startOverButton = document.getElementById("start_over");
const hintPara = document.querySelector(".hint_word");
let guessingName = { word: "", hint: "" };
let isGameOver = false;
let isBlack = true;
const wordsBlock = document.querySelector('.words');
const hintIcon = document.getElementById("hint-icon");
const infoIcon = document.getElementById('info-icon');
const backgroundIcon = document.getElementById('background-icon');
const infoInstructions = document.getElementById("game-info");
const lostmessage = document.querySelector(".lost-message");

// =============== adding event listeners to all word Inputs ================
[...wordContainer.children].forEach((wordRow) => {
  console.log("wordRow", wordRow);
  [...wordRow.children].forEach((eachInput) => {
    console.log("each input", eachInput);

    eachInput.addEventListener("keyup", (e) =>
      inputKeyUp(e, wordRow, eachInput)
    );
  });
});
//================== validations =======================
const areInputsInEachRowFilled = (row) => {
  //row will be array.
  let areValuesFilled = true;

  [...row.children].forEach((input) => {
    const value = input.value;

    if (value.length < 1) areValuesFilled = false;
  });

  if (!areValuesFilled) {
    alert("Please Fill all values");
    return false;
  }

  return true;
};

const clearData = () => {
	eachWordInput.forEach((input) => {
		input.value = '';
		input.style.background = 'black'
	})
}


const restartGame = () => {
  const randomNumber = Math.floor(Math.random() * api_data.length);

  guessingName = api_data[randomNumber];
  hintPara.innerHTML = "Hint: " + guessingName.hint;
  hintPara.style.background = 'bisque'
  clearData();
};

const writeLetterToNextInput = () => {};

const validations = (e, wordRow, eachInput) => {
  //matchEnteredWordsWithGuessingWord.

  //onInputFilled
  if (eachInput.value.length === 1) {
    const ifNextSibling = ifNextSiblingExists(eachInput);

    if (ifNextSibling) {
      eachInput.nextElementSibling.focus();
    }
  }

  //onEnterInputKey
  if (e.keyCode === 13) {

    if (areInputsInEachRowFilled(wordRow)) {
      if (matchEnteredWordsWithGuessingWord(wordRow)) {
		isGameOver = true;
		const iframe = document.createElement('iframe');

		iframe.src ='https://giphy.com/embed/BPJmthQ3YRwD6QqcVD';
		iframe.width = '80%';
		iframe.height = '80%';
		
		wordContainer.remove();
		wordsBlock.append(iframe);
	} else {
		const ifNextElementExist =  wordRow.nextElementSibling;


		if(ifNextElementExist){
			ifNextElementExist.children[0].focus();
		}else{
			isGameOver = true;
			hintPara.style.background = 'red';
			hintPara.style.color = 'black';
			const lostMsg = `Sorry, you could not identify the word ${guessingName.word}`
			hintPara.innerHTML = lostMsg; 
			lostmessage.innerHTML = lostMsg;
		}
      }
    }
  }
};

const deleteLetter = (input) => {
  const previousSibling = ifPreviousSiblingExists(input);

  if (previousSibling) input.previousElementSibling.focus();
};

const inputKeyUp = (event, wordRow, eachInput) => {

  if (event.key.toLowerCase() === "backspace") {
    deleteLetter(eachInput);
  } else if (/^[a-zA-Z]$/.test(event.key) || event.keyCode === 13) {
    validations(event, wordRow, eachInput);
  } else if (!/^[a-zA-Z]$/.test(event.key)) {
    alert("Put letters from a-z");
  }
};

const matchEnteredWordsWithGuessingWord = (row) => {
  let rowWord = [];
  const guessingWordArr = Array.from(guessingName.word.toLowerCase());
  [...row.children].forEach((input) => {
    rowWord.push(input.value.toLowerCase());
  });

  const greenWords = [];
  const yellowWords = [];
  const greyWords = [];

  if (rowWord.toString() === guessingWordArr.toString()) {
    row.style.background = "green";
    row.style.color = "white";

    [...row.children].forEach((e) => {
      e.style.background = "green";
      e.style.color = "white";
    });
  } else {
    for (let i = 0; i < rowWord.length; i++) {
      for (let j = 0; j < guessingWordArr.length; j++) {
        const rowInput = [...row.children][i];

        if (rowWord[i] === guessingWordArr[i]) {
          rowInput.style.background = "green";
          rowInput.style.color = "white";
        } else if (rowWord[i] !== guessingWordArr[j]) {
          if (guessingWordArr.includes(rowWord[i])) {
            rowInput.style.background = "yellow";
            rowInput.style.color = "black";
          } else if (!guessingWordArr.includes(rowWord[i])) {
            rowInput.style.background = "grey";
            rowInput.style.color = "white";
          }
        }
      }
    }
  }

  let countGreen = 0;

  [...row.children].forEach((input) => {
    console.log("backgroun color", {
      bg: input.style.background,
    });

    if (input.style.background === "green") countGreen += 1;
  });

  if(countGreen === 4) return true;

  return false;
};

const checkIfGameOver = (row) => {

};

const displayHint = () => {
	hintPara.style.display= 'block'
}

const displayInfo = () => {
	infoInstructions.style.display = 'block';
}

const lightMode = () => {
  const body = document.querySelector('body');
  isBlack = !isBlack;
  body.style.backgroundColor = isBlack ? 'black' : 'white';
  body.style.color = isBlack ? 'white' : 'black';
  [...wordContainer.children].forEach((wordRow) => {
    [...wordRow.children].forEach((input) => {
      input.style.backgroundColor = isBlack ? 'black' : 'white';
      input.style.color = isBlack ? 'white' : 'black';
    });
  });
}

//=============== Event Listeners ====================
startOverButton.addEventListener("click", restartGame);
hintIcon.addEventListener("click", displayHint);
infoIcon.addEventListener('click', displayInfo);
backgroundIcon.addEventListener('click', lightMode);

// ================= Util Functions =======================
const ifNextSiblingExists = (htmlElement) => {
  return htmlElement.nextElementSibling !== null;
};

const ifPreviousSiblingExists = (htmlElement) => {
  return htmlElement.previousElementSibling !== null;
};

const fetchAPIData = async () => {
  try {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    const data = await res.json();
    api_data = data.dictionary;
    // startOverBtn.disabled = false;
    // startOverBtn.innerText = 'Start Over';
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  fetchAPIData().then((res) => {
    restartGame();
  });
};

main();
