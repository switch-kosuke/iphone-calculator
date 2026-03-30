// ===== CalculatorEngine =====
const CalculatorEngine = {
  calculate(a, operator, b) {
    if (!isFinite(a) || !isFinite(b)) return NaN;
    if (operator === '+') {
      return parseFloat((a + b).toPrecision(12));
    }
    return NaN;
  },

  formatDisplay(value) {
    if (!isFinite(value)) return 'エラー';
    const rounded = parseFloat(value.toPrecision(12));
    if (Math.abs(rounded) >= 1e9 && rounded !== 0) {
      return rounded.toExponential();
    }
    return String(rounded);
  }
};

// ===== CalculatorState =====
function createCalculatorState() {
  return {
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    lastOperand: null,
    isResult: false,
  };
}

function handleDigitInput(state, digit) {
  // After result, fresh start
  if (state.isResult && !state.waitingForSecondOperand) {
    state.displayValue = digit === '.' ? '0.' : digit;
    state.firstOperand = null;
    state.operator = null;
    state.lastOperand = null;
    state.isResult = false;
    return;
  }

  // After operator, reset display
  if (state.waitingForSecondOperand) {
    state.displayValue = digit === '.' ? '0.' : digit;
    state.waitingForSecondOperand = false;
    state.isResult = false;
    return;
  }

  // Decimal point
  if (digit === '.') {
    if (state.displayValue.includes('.')) return;
    state.displayValue += '.';
    return;
  }

  // 9-digit limit
  const digitCount = (state.displayValue.match(/[0-9]/g) || []).length;
  if (digitCount >= 9) return;

  state.displayValue = state.displayValue === '0' ? digit : state.displayValue + digit;
  state.isResult = false;
}

function handleOperator(state, operator) {
  // Chain calculation: e.g., 3 + 5 + → compute 3+5 first
  if (state.operator && !state.waitingForSecondOperand && !state.isResult) {
    const secondOperand = parseFloat(state.displayValue);
    const result = CalculatorEngine.calculate(state.firstOperand, state.operator, secondOperand);
    state.displayValue = CalculatorEngine.formatDisplay(result);
    state.firstOperand = result;
  } else {
    state.firstOperand = parseFloat(state.displayValue);
  }
  state.operator = operator;
  state.waitingForSecondOperand = true;
  state.isResult = false;
}

function handleEquals(state) {
  if (state.operator === null) return;

  let secondOperand;
  if (state.isResult && state.lastOperand !== null) {
    // Repeated = : reuse last second operand
    secondOperand = state.lastOperand;
  } else if (state.waitingForSecondOperand) {
    // = pressed right after operator: use lastOperand or firstOperand
    secondOperand = state.lastOperand !== null ? state.lastOperand : state.firstOperand;
    if (state.lastOperand === null) state.lastOperand = secondOperand;
  } else {
    secondOperand = parseFloat(state.displayValue);
    state.lastOperand = secondOperand;
  }

  const result = CalculatorEngine.calculate(state.firstOperand, state.operator, secondOperand);
  state.displayValue = CalculatorEngine.formatDisplay(result);
  state.firstOperand = result;
  state.waitingForSecondOperand = false;
  state.isResult = true;
}

function handleClear(state, isAC) {
  if (isAC) {
    state.displayValue = '0';
    state.firstOperand = null;
    state.operator = null;
    state.waitingForSecondOperand = false;
    state.lastOperand = null;
    state.isResult = false;
  } else {
    state.displayValue = '0';
    state.isResult = false;
  }
}

if (typeof module !== 'undefined') {
  module.exports = { CalculatorEngine, createCalculatorState, handleDigitInput, handleOperator, handleEquals, handleClear };
}
