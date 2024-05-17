const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',];
const dot = '.';
const bracketLeft = '(';
const bracketRight = ')';
const action = ['+', '-', '/', 'x',];
const input = document.getElementById('input');
const resultField = document.getElementById('result');
const inactiveBracket = document.getElementById('inactive_bracket');
let isResult = false;
let allBracketsLeft = 0;
let allBracketsRight = 0;

function reduceFontSize() {
    while ((input.offsetWidth + inactiveBracket.offsetWidth) >= getMaxWidthInput()) {
        const currentFontSize = parseInt(window.getComputedStyle(input).fontSize);
        input.style.fontSize = currentFontSize - 4 + 'px';
        inactiveBracket.style.fontSize = input.style.fontSize;
    }
}

function limitFontReduction() {
    const minFontSize = 36;
    const currentFontSize = parseInt(window.getComputedStyle(input).fontSize);

    if(currentFontSize >= minFontSize) {
        reduceFontSize();
    }
}

function enlargeFontSize() {
    const currentFontSize = parseInt(window.getComputedStyle(input).fontSize);
    
    if ((input.offsetWidth + inactiveBracket.offsetWidth) < getMaxWidthInput() && input.style.fontSize < '64px') {
        input.style.fontSize = currentFontSize + 4 + 'px';
        inactiveBracket.style.fontSize = input.style.fontSize;
    }
}

function inputError() {
    input.animate([
        {
            transform: 'scale(1)',
            color: '#343436',
        },
        {
            transform: 'scale(1.1)',
            color: '#eb4034',
        },
        {
            transform: 'scale(1)',
            color: '#343436',
        },
      ], {
        duration: 180,
        easing: 'ease-out',
      });
}

function addSymbol(symbol) {
    setTextContent(handleAddedSymbol(symbol));
    limitFontReduction();
}

function deleteSymbol(symbol) {
    setTextContent(handleDeletedSymbol(symbol));
    enlargeFontSize();
}

function handleDeletedSymbol() {
    const lastSymbol = getTextContent()[getTextContent().length - 1];
    if (getTextContent().length > 0 && bracketLeft === lastSymbol) {
        allBracketsLeft--;
        inactiveBracket.textContent = bracketRight.repeat(allBracketsLeft);

        if (allBracketsLeft === 0  && getTextContent().length === 1) {
            return '0';
        }
    }
    if (getTextContent().length > 1 && bracketRight === lastSymbol) {
        allBracketsRight--;
        inactiveBracket.textContent = bracketRight.repeat(allBracketsLeft - allBracketsRight);
    }
    if (getTextContent().length > 1 && getTextContent() !== 'Error') {

        return getTextContent().slice(0, -1);
    }
    
    return '0';
}

function handleAddedSymbol(symbol) {
    const lastSymbol = getTextContent()[getTextContent().length - 1];
    const isSymbolZero = getTextContent() === '0';
    const isSymbolNotAction = !action.includes(symbol);
    const isSymbolNotDot = symbol !== '.';

    if (checkDots(symbol)) {
        inputError();
        return getTextContent();
    }
    if (action.includes(lastSymbol) && action.includes(symbol)) {
        isResult = false;

        return getTextContent().slice(0, -1) + symbol;
    }
    if (bracketLeft === lastSymbol && '-' === symbol) {
        return getTextContent() + symbol;
    }
    if ((dot === lastSymbol || bracketLeft === lastSymbol) && action.includes(symbol)) {
        isResult = false;
        inputError();

        return getTextContent();
    }
    if (!numbers.includes(lastSymbol) && dot === symbol) {
        isResult = false;
        inputError();

        return getTextContent();
    }
    if (bracketLeft === symbol && (numbers.includes(lastSymbol) || dot === lastSymbol || bracketRight === lastSymbol) && !isSymbolZero) {
        isResult = false;
        inputError();

        return getTextContent();
    }
    if (bracketRight === symbol && (action.includes(lastSymbol) || dot === lastSymbol || bracketLeft === lastSymbol || !(allBracketsLeft > allBracketsRight))) {
        isResult = false;
        inputError();

        return getTextContent();
    }
    if (bracketLeft === symbol) {
        allBracketsLeft++;
        inactiveBracket.textContent = bracketRight.repeat(allBracketsLeft - allBracketsRight);
    }
    if (bracketRight === symbol) {
        allBracketsRight++;
        inactiveBracket.textContent = bracketRight.repeat(allBracketsLeft - allBracketsRight);
    }
    if ((isSymbolZero && (numbers.includes(symbol) || '-' === symbol || bracketLeft === symbol)) || (isResult && isSymbolNotAction && isSymbolNotDot)) {
        isResult = false;
        input.style.fontSize = '64px';

        return symbol;
    }
    if (bracketRight === lastSymbol && numbers.includes(symbol)) {
        inputError();
        
        return getTextContent();
    }
    if (numbers.includes(symbol) && '0' == lastSymbol && action.includes(getTextContent()[getTextContent().length - 2])) {
        return getTextContent().slice(0, -1) + symbol;
    }
    
    isResult = false;

    return getTextContent() + symbol;
}

function checkDots(symbol) {
    const symbols = getTextContent().split('');
    const actionSymbols = symbols.filter(function (symbol) {
        return [...action, bracketLeft, bracketRight].includes(symbol);
    });
    let lastNumber = getTextContent();

    const allNumber = [];
    actionSymbols.forEach(symbol => {
        allNumber.push(getTextContent().split(symbol))
    });
    if (allNumber.length !== 0) {
        const lastArray = allNumber[allNumber.length - 1];
        const lastNumberArray = lastArray[lastArray.length - 1];
        lastNumber = lastNumberArray;
    }

    return lastNumber.includes(dot) && dot === symbol;
}

function allClear() {
    setTextContent(0);
    allBracketsLeft = 0;
    inactiveBracket.textContent = '';
    allBracketsRight = 0;
    input.style.fontSize = '64px';
    inactiveBracket.style.fontSize = '64px';
}

function validedResult(result) {
    const resultToNumber = Number(result);

    if (isNaN(result) || result === Infinity) {
        return result = 'Error';
    }

    if (Number.isInteger(resultToNumber) == true) {
        return resultToNumber.toFixed(0);
    }
    else {
        return parseFloat(resultToNumber.toFixed(6));
    }
}

function getTextContent() {
    return input.textContent;
}

function setTextContent(string) {
    input.textContent = string;
}

function getMaxWidthInput() {
    return resultField.offsetWidth - 20;
}

function checkActionPriority(symbol) {
    if ('+' === symbol || '-' === symbol) {
        return 1;
    }
    if ('x' === symbol || '/' === symbol) {
        return 2;
    }

    return 0;
}

function getBalancedExpression() {
    if (allBracketsLeft > allBracketsRight) {
        const inactiveBracketsNumber = allBracketsLeft - allBracketsRight;
        inactiveBracket.textContent = '';
        allBracketsLeft = 0;

        return getTextContent() + bracketRight.repeat(inactiveBracketsNumber);
    }

    return getTextContent();
}

function calculate() {
    const numbersStack = new Stack();
    const actionsStack = new Stack();
    const symbols = getBalancedExpression().split('');
    const numbersArray = symbols.map(function (symbol, index) {
        const isNegativeNumer = (index === 0 || symbols[index - 1] === bracketLeft) && '-' === symbol;

        if ([...action, bracketLeft, bracketRight].includes(symbol) && !isNegativeNumer) {
            return ` ${symbol} `;
        }

        return symbol;
    });
    const arrayToString = numbersArray.join('');
    const stringToArray = arrayToString.split(' ');
    const finalArray = stringToArray.filter(function (symbol) {
        return symbol !== '';
    })

    finalArray.forEach((symbol) => {
        const isPriorityCheck = checkActionPriority(actionsStack.getLastElement()) < checkActionPriority(symbol);
        const isbracketLeft = bracketLeft === symbol;
        const isNotNumbers = !numbers.includes(symbol);
        if (![...action, bracketLeft, bracketRight].includes(symbol)) {
            numbersStack.addElement(symbol);
        }
        else if (isNotNumbers && (actionsStack.getLength() === 0 || isbracketLeft || isPriorityCheck)) {
            actionsStack.addElement(symbol);
        }
        else if (bracketRight === symbol) {
            while (actionsStack.getLastElement() !== bracketLeft) {
                countStack(numbersStack, actionsStack);
            }
            actionsStack.getElement();
        }
        else {
            countStack(numbersStack, actionsStack);
            actionsStack.addElement(symbol);
        }
    })
    
    result(numbersStack, actionsStack);
    resizingResult();
    isResult = true;
}

function countStack(numbersStack, actionsStack) {
    const b = Number(numbersStack.getElement());
    const a = Number(numbersStack.getElement());
    const lastAction = actionsStack.getElement();

    if (lastAction === '+') {
        numbersStack.addElement(a + b);
    }
    if (lastAction === '-') {
        numbersStack.addElement(a - b);
    }
    if (lastAction === 'x') {
        numbersStack.addElement(a * b);
    }
    if (lastAction === '/') {
        numbersStack.addElement(a / b);
    }
}

function result(numbersStack, actionsStack) {
    while (actionsStack.getLength() !== 0) {
        countStack(numbersStack, actionsStack);
    }

    let result = numbersStack.getElement();

    setTextContent(validedResult(result));
}

function resizingResult() {
    input.style.fontSize = '64px';

    if (input.offsetWidth < getMaxWidthInput()) {
        input.style.fontSize = '64px';
    }
    while (input.offsetWidth > getMaxWidthInput()) {
        const currentFontSize = parseInt(window.getComputedStyle(input).fontSize);
        input.style.fontSize = currentFontSize - 1 + 'px';
    }
}
class Stack {
    array = [];

    getElement() {
        return this.array.pop();
    }

    addElement(element) {
        this.array.push(element);
    }

    getLength() {
        return this.array.length;
    }

    getLastElement() {
        return this.array[this.array.length - 1];
    }
}