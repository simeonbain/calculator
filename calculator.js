/* -- Global variables -- */ 
let operand1 = null; 
let operand2 = null; 
let operationInProgress  = null;
let displayValue = `_`;
let lastKey;  

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
    case `x`:
      return multiply(num1, num2);
    case `/`:
      return divide(num1, num2); 
    default: 
      return num2; 
  }
}

/* -- Input and display handling -- */ 
function inputController(evt) {
  const key = evt.target;
  if (key.classList.contains(`key-dec`)) {
    handleDecimalInput();

  } else if (key.classList.contains(`key-num`)) {
    handleNumericInput(evt.target.dataset.value);

  } else if (key.classList.contains(`key-op`)) {
    handleOperatorInput(evt.target.dataset.value);

  } else if (key.dataset.value === `clear`) {
    clear();

  } else if (key.dataset.value === `reset`) {
    reset(); 

  } else {
    console.log(`ERROR: Unkown input`);
  }

  updateDisplay(); 
}

function handleDecimalInput() {
  if (displayValue.includes(`.`) || displayValue === `_`) {
    // only one decimal place allowed per value, and decimal cannot be leading
    return; 

  } else {
    displayValue = `${displayValue}.`;
  }

  operand2 = +displayValue; 
}

function handleNumericInput(num) {
  if (displayValue === `0` || displayValue === `_` || operand2 === null) {
    displayValue = `${num}`;

  } else {
    displayValue = `${displayValue}${num}`;
  }

  operand2 = +displayValue; 
}

function handleOperatorInput(operator) {
  if (displayValue === `_`) {
    return; // there is no operation to be done, so ignore
  }

  // perform the operation
  operand2 = +displayValue; 
  operand1 = operate(operand1, operand2, operationInProgress);
  displayValue = `${operand1}`; 

  // setup for the next operation
  operand2 = null; 
  operationInProgress = operator; 
}

function clear() {
  if (displayValue !== `_` && operand1 !== null) {
    displayValue = `${operand1}`;

  } else {
    displayValue = `_`;
  }

  operationInProgress = null; 
}

function reset() {
  operand1 = null; 
  operand2 = null; 
  operationInProgress = null;
  displayValue = `_`; 
}

function updateDisplay() {
  display.textContent = insertDecimalSeparators(displayValue); 
}

function insertDecimalSeparators(numString) {
  // Convert whole number part of the string to an array
  let wholeNumArray = []; 
  let decimalString = ``; 
  if (numString.includes(`.`)) {
    wholeNumArray = [...numString.split(`.`)[0]]; 
    decimalString = `.${numString.split(`.`)[1]}`; 
  } else {
    wholeNumArray = [...numString]; 
  }

  // Insert decimal separator every third whole digit from the right hand side
  wholeNumArray = wholeNumArray.map((digit, index) => {
    if ((wholeNumArray.length - index) % 3 === 0 && index > 0) {
      return `,${digit}`;
    } else {
      return digit; 
    }
  });

  // Convert back to one string and return 
  return `${wholeNumArray.join(``)}${decimalString}`; 
}

/* -- Query selectors -- */
const display = document.querySelector(`.screen p`);
const keys = document.querySelectorAll(`.key`);

/* -- Event listeners -- */ 
keys.forEach(key => key.addEventListener(`click`, inputController));

