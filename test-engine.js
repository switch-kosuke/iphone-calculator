// Simple test helper
let passed = 0, failed = 0;
function assertEqual(actual, expected, msg) {
  if (actual === expected) { console.log(`✓ ${msg}`); passed++; }
  else { console.error(`✗ ${msg}: expected "${expected}", got "${actual}"`); failed++; }
}
function assert(cond, msg) {
  if (cond) { console.log(`✓ ${msg}`); passed++; }
  else { console.error(`✗ ${msg}`); failed++; }
}

const { CalculatorEngine } = require('./calculator-state.js');

// calculate tests
assertEqual(CalculatorEngine.calculate(1, '+', 2), 3, 'calculate: 1+2=3');
assertEqual(CalculatorEngine.calculate(0.1, '+', 0.2), 0.3, 'calculate: 0.1+0.2=0.3 (float fix)');
assertEqual(CalculatorEngine.calculate(100, '+', 200), 300, 'calculate: 100+200=300');

// formatDisplay tests
assertEqual(CalculatorEngine.formatDisplay(3), '3', 'formatDisplay: integer no decimal');
assertEqual(CalculatorEngine.formatDisplay(3.14), '3.14', 'formatDisplay: decimal trailing zero omit');
assertEqual(CalculatorEngine.formatDisplay(3.10), '3.1', 'formatDisplay: trailing zero omitted');
assert(CalculatorEngine.formatDisplay(1000000000).includes('e'), 'formatDisplay: 1e9+ uses exponential');
assertEqual(CalculatorEngine.formatDisplay(Infinity), 'エラー', 'formatDisplay: Infinity returns error');
assertEqual(CalculatorEngine.formatDisplay(NaN), 'エラー', 'formatDisplay: NaN returns error');

// subtraction tests
assertEqual(CalculatorEngine.calculate(8, '-', 3), 5, 'calculate: 8-3=5');
assertEqual(CalculatorEngine.calculate(0.3, '-', 0.1), 0.2, 'calculate: 0.3-0.1=0.2 (float fix)');
assertEqual(CalculatorEngine.calculate(3, '-', 8), -5, 'calculate: 3-8=-5 (negative result)');
assert(isNaN(CalculatorEngine.calculate(Infinity, '-', 1)), 'calculate: Infinity-1=NaN');

console.log(`\nEngine tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
