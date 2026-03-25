window.onload = function() {
    let a = '';
    let b = '';
    let expressionResult = '';
    let selectedOperation = null;

    const outputElement = document.getElementById("result");

    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');

    const K = 5.0;
    const alpha = 0.8;
    let prevY = 0;

    function calculateTransfer(inputSignal){
        let currentY = alpha * prevY + (1 - alpha) * K * inputSignal;
        prevY = currentY;
        return prevY.toFixed(4);
    }
    function updateDisplay(value){
        outputElement.innerHTML = value;
        outputElement.scrollLeft = outputElement.scrollWidth;
    }
    function onDigitButtonClicked(digit){
        if (!selectedOperation){
            if ((digit != ".") || (digit == "." && !a.includes(digit))) {
                a += digit;
            }
            updateDisplay(a || '0');
        }

        else {
            if ((digit != ".") || (digit == "." && !b.includes(digit))){
                b += digit;
                updateDisplay(b || '0');
            }
        }
    }

    digitButtons.forEach(button => {
        button.onclick = function (){
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        };
    });

    document.getElementById("btn_op_mult").onclick = function (){
        if (a === ' ') return;
        selectedOperation = 'x';
    }
    document.getElementById("btn_op_plus").onclick = function (){
        if (a === ' ') return;
        selectedOperation = '+';
    }
    document.getElementById("btn_op_minus").onclick = function (){
        if (a === ' ') return;
        selectedOperation = '-';
    }
    document.getElementById("btn_op_div").onclick = function (){
        if (a === ' ') return;
        selectedOperation = '/';
    }
    document.getElementById("btn_op_del").onclick = function (){
       if (!selectedOperation) {
            a = a.slice(0, -1);
            updateDisplay(a);
        } else {
            b = b.slice(0, -1);
            updateDisplay(b);
        }
    }
    document.getElementById("btn_op_sqr").onclick = function (){
        if (!selectedOperation && a) {
            a = String(Math.pow(Number(a), 2));
            updateDisplay(a);
        } else if (b) {
            b = String(Math.pow(Number(b), 2));
            updateDisplay(b);
        }
    }
    document.getElementById("btn_op_fact").onclick = function (){
        const f = (n) => (n <= 1) ? 1 : n * f(n - 1);
        if (!selectedOperation && a) {
            a = String(f(Math.floor(Number(a))));
            updateDisplay(a);
        } else if (b) {
            b = String(f(Math.floor(Number(b))));
            updateDisplay(b);
        }
    }
    document.getElementById("btn_op_sqrt").onclick = function (){
        if (!selectedOperation && a) {
            a = String(Math.sqrt(Number(a)));
            updateDisplay(a);
        } else if (b) {
            b = String(Math.sqrt(Number(b)));
            updateDisplay(b);
        }
    }
    document.getElementById("btn_digit_000").onclick = function (){
        if (a === ' ') return;
        selectedOperation = '000';
    }
    document.getElementById("btn_color_bg").onclick = function() {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        document.body.style.backgroundColor = randomColor;
    };

    document.getElementById("btn_color_screen").onclick = function() {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        outputElement.style.backgroundColor = randomColor;
    };

     document.getElementById("btn_op_clear").onclick = function() {
        a = ''
        b = ''
        expressionResult = ''
        selectedOperation = ''
        prevY = 0
        updateDisplay('0')
     }

     document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || b === '' || !selectedOperation) return;
        switch (selectedOperation) {
            case 'x':
                expressionResult = (+a) * (+b)
                break;
            case '+':
                expressionResult = (+a) + (+b)
                break;
            case '-':
                expressionResult = (+a) - (+b)
                break;
            case '/':
                expressionResult = (+a) / (+b)
                break;

            default:
                break;
        }
        a = expressionResult.toString()
        b = ''
        selectedOperation = null

        updateDisplay(a);
     }
     document.getElementById("btn_special").onclick = function (){
        let inputX = parseFloat(outputElement.innerHTML);
        if (isNaN(inputX)) inputX = 0;

        let outputY = calculateTransfer(inputX);

        updateDisplay(outputY);
        a = outputY;
        b = ''
        selectedOperation = null
    }
}
