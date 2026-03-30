function initCalculator() {
  const state = createCalculatorState();

  function render() {
    // Display value
    const display = document.getElementById('display');
    const len = state.displayValue.length;
    let sizeClass = 'text-7xl';
    if (len >= 10) sizeClass = 'text-3xl';
    else if (len >= 7) sizeClass = 'text-5xl';
    display.textContent = state.displayValue;
    display.className = `text-white font-light text-right pr-6 pb-2 w-full overflow-hidden ${sizeClass}`;

    // AC/C label
    const clearBtn = document.getElementById('btn-clear');
    const showC = state.displayValue !== '0' && !state.isResult;
    clearBtn.textContent = showC ? 'C' : 'AC';
    clearBtn.setAttribute('aria-label', showC ? '消去' : '全消去');

    // Operator highlight
    const baseClass = 'w-20 h-20 rounded-full text-2xl font-medium flex items-center justify-center cursor-pointer hover:brightness-125 transition-all min-w-[44px] min-h-[44px]';
    const addBtn = document.getElementById('btn-add');
    const addHighlighted = state.operator === '+' && state.waitingForSecondOperand;
    if (addHighlighted) {
      addBtn.className = `${baseClass} bg-white text-[#FF9500]`;
    } else {
      addBtn.className = `${baseClass} bg-[#FF9500] text-white`;
    }
    const subtractBtn = document.getElementById('btn-subtract');
    const subtractHighlighted = state.operator === '-' && state.waitingForSecondOperand;
    if (subtractHighlighted) {
      subtractBtn.className = `${baseClass} bg-white text-[#FF9500]`;
    } else {
      subtractBtn.className = `${baseClass} bg-[#FF9500] text-white`;
    }
  }

  // Digit buttons
  document.querySelectorAll('[data-digit]').forEach(btn => {
    btn.addEventListener('click', () => {
      handleDigitInput(state, btn.dataset.digit);
      render();
    });
  });

  // Operator buttons
  document.getElementById('btn-add').addEventListener('click', () => {
    handleOperator(state, '+');
    render();
  });
  document.getElementById('btn-subtract').addEventListener('click', () => {
    handleOperator(state, '-');
    render();
  });

  // Equals button
  document.getElementById('btn-equals').addEventListener('click', () => {
    handleEquals(state);
    render();
  });

  // Clear button
  document.getElementById('btn-clear').addEventListener('click', () => {
    const isAC = document.getElementById('btn-clear').textContent === 'AC';
    handleClear(state, isAC);
    render();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      handleDigitInput(state, e.key);
    } else if (e.key === '.') {
      e.preventDefault();
      handleDigitInput(state, '.');
    } else if (e.key === '+') {
      e.preventDefault();
      handleOperator(state, '+');
    } else if (e.key === '-') {
      e.preventDefault();
      handleOperator(state, '-');
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      handleEquals(state);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClear(state, true);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      handleClear(state, false);
    } else {
      return;
    }
    render();
  });

  render();
}

document.addEventListener('DOMContentLoaded', initCalculator);
