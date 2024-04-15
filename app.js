const resultElement = document.getElementById('result');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const submitBtn = document.getElementById('submit');
const plusBtn = document.getElementById('plus');
const minusBtn = document.getElementById('minus');
const ultiplyBtn = document.getElementById('multiply');
const divideBtn = document.getElementById('divide');
let action = '+';


// console.log(typeof sum)
// console.log(resultElement.textContent)

plusBtn.onclick = function (){
    action = '+';
}

minusBtn.onclick = function (){
    action = '-';
}

ultiplyBtn.onclick = function (){
    action = '*';
}

divideBtn.onclick = function (){
    action = '/';
}

function printResult(result){
    if (result < 0){
        resultElement.style.color = 'red';
    }
    else {
        resultElement.style.color = 'green';
    } 
    resultElement.textContent = result;
}

function computeNumbersWithAction(input1, input2, actionSymbol){
    const num1 = Number(input1.value);
    const num2 = Number(input2.value);
    console.log(input1);

    if(actionSymbol == '+'){
        return num1 + num2;
    }
    else if(actionSymbol == '-') {
        return num1 - num2;
    }
    else if(actionSymbol == '*') {
        return num1 * num2;
    }
    else {
        return num1 / num2;
    }
}


submitBtn.onclick = function () {    
    printResult(computeNumbersWithAction(input1, input2, action))
}

