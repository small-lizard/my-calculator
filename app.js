const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',];
const dot = '.';
const bracketLeft = '(';
const bracketRight = ')';
const action = ['+', '-', '/', 'x',];
const input = document.getElementById('input');
let isResult = false;
let allBracketsLeft = 0;
let allBracketsRight = 0;

function addSymbol(symbol) {
    setTextContent(handleAddedSymbol(symbol));
}

function deleteSymbol(symbol) {
    setTextContent(handleDeletedSymbol(symbol));
}

function handleDeletedSymbol() {
    const lastSymbol = getTextContent()[getTextContent().length - 1];
    if (getTextContent().length > 0 && bracketLeft === lastSymbol) {
        allBracketsLeft--;
        return getTextContent().slice(0, -1);
    }
    if (getTextContent().length > 1 && bracketRight === lastSymbol) {
        allBracketsRight--;
        return getTextContent().slice(0, -1);
    }
    if (getTextContent().length > 1 && bracketRight !== lastSymbol && bracketLeft !== lastSymbol) {
        return getTextContent().slice(0, -1);
    }

    return "0";
}

function handleAddedSymbol(symbol) {
    const lastSymbol = getTextContent()[getTextContent().length - 1];
    const isSymbolZero = getTextContent() === '0';
    const isSymbolNotAction = !action.includes(symbol);
    const isSymbolNotDot = symbol !== '.';

    if (checkDots(symbol)) {
        return getTextContent();
    }
    if (action.includes(lastSymbol) && action.includes(symbol)) {
        isResult = false;

        return getTextContent().slice(0, -1) + symbol;
    }
    if ((dot === lastSymbol || bracketLeft === lastSymbol) && action.includes(symbol)) {
        isResult = false;

        return getTextContent();
    }
    if (!numbers.includes(lastSymbol) && dot === symbol) {
        isResult = false;

        return getTextContent();
    }
    if (bracketLeft === symbol && (numbers.includes(lastSymbol) || dot === lastSymbol || bracketRight === lastSymbol) && !isSymbolZero) {
        isResult = false;

        return getTextContent();
    }
    if (bracketRight === symbol && (action.includes(lastSymbol) || dot === lastSymbol || bracketLeft === lastSymbol || !(allBracketsLeft > allBracketsRight))) {
        isResult = false;
        console.log(action.includes(lastSymbol), dot === lastSymbol, bracketLeft === lastSymbol, !(allBracketsLeft > allBracketsRight))
        return getTextContent();
    }
    if (bracketLeft === symbol) {
        allBracketsLeft++;
    }
    if (bracketRight === symbol) {
        allBracketsRight++;
    }
    if ((isSymbolZero && isSymbolNotAction && isSymbolNotDot) || (isResult && isSymbolNotAction && isSymbolNotDot)) {
        isResult = false;
        return symbol;
    }
    if (bracketRight === lastSymbol && numbers.includes(symbol)) {
        return getTextContent();
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
}

function validedResult(result) {
    if (result === Math.floor(result)) {
        return result.toFixed(0);
    }
    else {
        return result.toFixed(1);
    }
}

function getTextContent() {
    return input.textContent;
}

function setTextContent(string) {
    input.textContent = string;
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

function calculate() {
    const numbersStack = new Stack();
    const actionsStack = new Stack();
    const symbols = getTextContent().split('');
    const numbersArray = symbols.map(function (symbol) {
        if ([...action, bracketLeft, bracketRight].includes(symbol)) {
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
            while(actionsStack.getLastElement() !== bracketLeft) {
                countStack(numbersStack, actionsStack);
            }
            actionsStack.getElement();
        }
        else {
            countStack(numbersStack, actionsStack);
            actionsStack.addElement(symbol);
        }
    })
    result(numbersStack,actionsStack);
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

function result(numbersStack,actionsStack) {
    while(actionsStack.getLength() !== 0) {
        countStack(numbersStack,actionsStack);
    }
    const result = numbersStack.getElement();
    setTextContent(validedResult(result));
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