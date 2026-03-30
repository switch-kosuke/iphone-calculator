let passed = 0, failed = 0;
function assertEqual(actual, expected, msg) {
  if (actual === expected) { console.log(`✓ ${msg}`); passed++; }
  else { console.error(`✗ ${msg}: expected "${expected}", got "${actual}"`); failed++; }
}
function assert(cond, msg) {
  if (cond) { console.log(`✓ ${msg}`); passed++; }
  else { console.error(`✗ ${msg}`); failed++; }
}

const { createCalculatorState, handleDigitInput, handleOperator, handleEquals, handleClear } = require('./calculator-state.js');

// --- handleDigitInput tests ---
let s = createCalculatorState();
handleDigitInput(s, '3');
assertEqual(s.displayValue, '3', 'digit: 3 appended to 0');

s = createCalculatorState();
handleDigitInput(s, '1');
handleDigitInput(s, '2');
handleDigitInput(s, '3');
assertEqual(s.displayValue, '123', 'digit: 123 appended sequentially');

// 9-digit limit
s = createCalculatorState();
for (let i = 0; i < 10; i++) handleDigitInput(s, '1');
assertEqual(s.displayValue, '111111111', 'digit: 9-digit limit enforced');

// decimal point
s = createCalculatorState();
handleDigitInput(s, '3');
handleDigitInput(s, '.');
handleDigitInput(s, '1');
assertEqual(s.displayValue, '3.1', 'decimal: 3.1 input');

// decimal point duplicate ignored
s = createCalculatorState();
handleDigitInput(s, '3');
handleDigitInput(s, '.');
handleDigitInput(s, '.');
handleDigitInput(s, '1');
assertEqual(s.displayValue, '3.1', 'decimal: duplicate dot ignored');

// waitingForSecondOperand reset
s = createCalculatorState();
handleDigitInput(s, '3');
handleOperator(s, '+');
handleDigitInput(s, '5');
assertEqual(s.displayValue, '5', 'digit: reset display when waitingForSecondOperand');

// --- handleOperator + handleEquals: 3+5=8 ---
s = createCalculatorState();
handleDigitInput(s, '3');
handleOperator(s, '+');
handleDigitInput(s, '5');
handleEquals(s);
assertEqual(s.displayValue, '8', 'equals: 3+5=8');

// --- handleEquals repeated: = repeats last addition ---
s = createCalculatorState();
handleDigitInput(s, '3');
handleOperator(s, '+');
handleDigitInput(s, '5');
handleEquals(s);
assertEqual(s.displayValue, '8', 'equals repeated: 3+5=8');
handleEquals(s);
assertEqual(s.displayValue, '13', 'equals repeated: 8+5=13');
handleEquals(s);
assertEqual(s.displayValue, '18', 'equals repeated: 13+5=18');

// --- handleClear AC ---
s = createCalculatorState();
handleDigitInput(s, '5');
handleOperator(s, '+');
handleDigitInput(s, '3');
handleClear(s, true);
assertEqual(s.displayValue, '0', 'AC: displayValue reset to 0');
assertEqual(s.firstOperand, null, 'AC: firstOperand cleared');
assertEqual(s.operator, null, 'AC: operator cleared');
assertEqual(s.waitingForSecondOperand, false, 'AC: waiting cleared');

// --- handleClear C ---
s = createCalculatorState();
handleDigitInput(s, '5');
handleOperator(s, '+');
handleDigitInput(s, '3');
handleClear(s, false);
assertEqual(s.displayValue, '0', 'C: displayValue reset to 0');
assertEqual(s.firstOperand, 5, 'C: firstOperand preserved');
assertEqual(s.operator, '+', 'C: operator preserved');

// --- AC/C label logic ---
s = createCalculatorState();
assert(s.displayValue === '0' || s.isResult, 'AC/C: shows AC on initial state');
handleDigitInput(s, '5');
assert(s.displayValue !== '0' && !s.isResult, 'AC/C: shows C when input exists');

// --- subtraction flow tests ---
s = createCalculatorState();
handleDigitInput(s, '8');
handleOperator(s, '-');
handleDigitInput(s, '3');
handleEquals(s);
assertEqual(s.displayValue, '5', 'subtract: 8-3=5');

// repeated equals
s = createCalculatorState();
handleDigitInput(s, '8');
handleOperator(s, '-');
handleDigitInput(s, '3');
handleEquals(s);
assertEqual(s.displayValue, '5', 'subtract repeated: 8-3=5');
handleEquals(s);
assertEqual(s.displayValue, '2', 'subtract repeated: 5-3=2');
handleEquals(s);
assertEqual(s.displayValue, '-1', 'subtract repeated: 2-3=-1');

// operator switch from + to -
s = createCalculatorState();
handleDigitInput(s, '5');
handleOperator(s, '+');
handleOperator(s, '-');
assertEqual(s.operator, '-', 'operator switch: + -> -');

// AC clears operator
s = createCalculatorState();
handleDigitInput(s, '5');
handleOperator(s, '-');
handleClear(s, true);
assertEqual(s.operator, null, 'AC: operator cleared after subtract');
assertEqual(s.displayValue, '0', 'AC: displayValue reset after subtract');

console.log(`\nState tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
