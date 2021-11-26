/* -- Constants -- */ 
const maxDisplayDigits = 11; 

/* -- Global variables -- */ 
let operand1 = null; 
let operand2 = null; 
let operationInProgress  = null;
let displayValue = `_`;

/* -- Calculation logic -- */ 
function add(num1, num2) { 
  return num1 + num2; 
}

function subtract(num1, num2) {
  return num1 - num2; 
}

function multiply(num1, num2) {
  return num1 * num2; 
}

function divide(num1, num2) {
  return num1 / num2; 
}

function operate(num1, num2, operator) {
  num1 = +num1; 
  num2 = +num2; 
  operator = String(operator);

  switch (operator) {
    case '+': 
      return add(num1, num2); 
    case '-': 
      return subtract(num1, num2); 
    case `*`:
      return multiply(num1, num2);
    case `/`:
      return divide(num1, num2); 
    default: 
      return num2; 
  }
}

/* -- Actions to perform on window load -- */ 
function onLoad() {
  // Set the theme that is toggled on
  themeToggle.forEach(theme => {
    if (theme.checked) {
      setTheme(theme.value);
    }
  }); 
}

/* -- Mouse/touch input -- */ 
function screenInputController(evt) {
  const key = evt.target;

  if (key.classList.contains(`key-dec`)) {
    handleDecimalInput();

  } else if (key.classList.contains(`key-num`)) {
    handleNumericInput(evt.target.dataset.value);

  } else if (key.classList.contains(`key-op`)) {
    handleOperatorInput(evt.target.dataset.value);

  } else if (key.dataset.value === `backspace`) {
    backspace();

  } else if (key.dataset.value === `reset`) {
    reset(); 
  } 

  updateDisplay(); 
}

function touchStartInput(evt) {
  // Prevent any further handling (eg. click event on the same element)
  evt.preventDefault(); 

  screenInputController(evt); 
}

/* -- Keyboard input -- */ 
function keyboardInputController(evt) {
  let validInput = true; 

  if (evt.key === `.`) {
    handleDecimalInput(); 

  } else if (/^\d+$/.test(evt.key)) {
    handleNumericInput(evt.key);

  } else if (/[\+\-\*\/\=]/.test(evt.key)) {
    handleOperatorInput(evt.key);

  } else if (evt.key === `Enter`) {
    handleOperatorInput(`=`);

  } else if (evt.key === `Backspace`) {
    backspace(); 

  } else if (evt.key === `Escape`) {
    reset(); 

  } else {
    validInput = false; 
  }

  if (validInput) {
    // Prevent any browser actions tied to these keyboard keys
    evt.preventDefault();
  }

  updateDisplay(); 
}

/* -- Input and display handling -- */ 
function handleDecimalInput() {
  if (displayValue.includes(`.`) || displayValue === `_` || operand2 === null) {
    // Only one decimal place allowed per value, and decimal cannot be leading
    return; 

  } else if (displayValue.length < maxDisplayDigits) {
    displayValue = `${displayValue}.`;
  }

  operand2 = +displayValue; 
}

function handleNumericInput(num) {
  if (displayValue === `0` || displayValue === `_` || operand2 === null) {
    displayValue = `${num}`;

  } else if (displayValue.length < maxDisplayDigits) {
    displayValue = `${displayValue}${num}`;
  }

  operand2 = +displayValue; 
}

function handleOperatorInput(operator) {
  if (displayValue === `_`) {
    return; // there is no operation to be done, so ignore
  }

  // Perform the operation
  operand2 = +displayValue; 
  operand1 = operate(operand1, operand2, operationInProgress);
  displayValue = `${operand1}`; 

  // Setup for the next operation
  operand2 = null; 
  operationInProgress = operator; 
}

function backspace() {
  if (operand2 === null) {
    operationInProgress = null; 
    return; 

  } else {
    displayValue = displayValue.slice(0, -1); 

    if (displayValue === ``) {
      displayValue = `_`;
      operand2 = null; 
    } else {
      operand2 = +displayValue;
    }
  }
}

function reset() {
  operand1 = null; 
  operand2 = null; 
  operationInProgress = null;
  displayValue = `_`; 
}

function updateDisplay() {
  if (displayValue === `Infinity`) {
    display.textContent = `Inf`; 

  } else {
    display.textContent = insertDecimalSeparators(displayValue); 
  }
}

function insertDecimalSeparators(numString) {
  // Ensure the output fits within the display length
  const wholeNumLength = `${Math.floor(+numString)}`.length;
  if (wholeNumLength > maxDisplayDigits) {
    // Return an out of range message if the whole number portion is too long
    return `Out of range`;

  } else if (numString.length > maxDisplayDigits) {
    // Round any decimal portion to fit within the display length
    numString = (+numString).toFixed(maxDisplayDigits 
      - wholeNumLength);
    
    // Remove any trailing zeros after decimal place
    numString = `${parseFloat(numString)}`;
  }

  // Convert whole number part of the string to an array and store the decimal 
  // part of the string 
  let wholeNumArray = []; 
  let decimalString = ``; 
  if (numString.includes(`.`)) {
    wholeNumArray = [...numString.split(`.`)[0]]; 
    decimalString = `.${numString.split(`.`)[1]}`; 

  } else {
    wholeNumArray = [...numString]; 
  }
  
  // Pull out the negative sign, if any
  let signString = ``;
  if (wholeNumArray[0] === `-`) {
    signString = wholeNumArray.shift();
  }

  // Insert decimal separator every third whole digit from the right hand side
  wholeNumArray = wholeNumArray.map((digit, index) => {
    if ((wholeNumArray.length - index) % 3 === 0 && index > 0) {
      return `,${digit}`;

    } else {
      return digit; 
    }
  });

  // Combine the whole number part and decimal part and return
  return `${signString}${wholeNumArray.join(``)}${decimalString}`;
}

/* -- Theme selection -- */ 
function themeSelector(evt) {
  setTheme(evt.target.value);
}

function themeLooper(evt) {
  // Prevent any further handling (eg. click event on the same element)
  evt.preventDefault(); 

  // Find which theme is currently set
  const numThemes = themeToggle.length; 
  let currentThemeIndex = null; 
  themeToggle.forEach((theme, index) => {
    if (theme.checked) {
      currentThemeIndex = index; 
    }
  });

  // Work out which theme is next in the loop
  let newThemeIndex = null; 
  if (currentThemeIndex === numThemes - 1) {
    newThemeIndex = 0;
  } else {
    newThemeIndex = currentThemeIndex + 1; 
  }  

  // Disable the current theme and set the next theme
  themeToggle[currentThemeIndex].checked = false; 
  themeToggle[newThemeIndex].checked = true; 
  setTheme(themeToggle[newThemeIndex].value); 
}

function setTheme(themeNumber) {
  // remove any existing theme
  htmlEl.classList.forEach(className => { 
    if (className.includes(`theme`)) {
      htmlEl.classList.remove(className); 
    }
  });

  // add the selected theme 
  htmlEl.classList.add(`theme-${themeNumber}`);
}

/* -- Query selectors -- */
const htmlEl = document.querySelector(`html`); 
const display = document.querySelector(`.screen p`);
const keys = document.querySelectorAll(`.key`);
const themeToggle = document.querySelectorAll(`.toggle-tw input`);

/* -- Event listeners -- */ 
window.addEventListener(`load`, onLoad); 
keys.forEach(key => key.addEventListener(`click`, screenInputController));
keys.forEach(key => key.addEventListener(`touchstart`, touchStartInput));
document.addEventListener(`keydown`, keyboardInputController);
themeToggle.forEach(theme => theme.addEventListener(`click`, themeSelector));
themeToggle.forEach(theme => theme.addEventListener(`touchstart`, themeLooper));
