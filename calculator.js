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
      console.log(`ERROR: Unexpected operator`); 
  }
  return; 
}

