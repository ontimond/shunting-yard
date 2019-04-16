require('./operators');
require('./functions');

Array.prototype.peek  = function () { return  this.slice(-1)[0]; };
Array.prototype.empty = function () { return  this.length == 0;  };
// Array.prototype.clean = function () { this.length = 0;           };

const SYER = 'SYNTAX ERROR';
const ARER = 'ARGUMENT ERROR';
function parse(expression) {
  let tokens = expression.match(/[^\d()]+|[\d.]+/g);
  let output = [];
  let stack  = [];

  for (token of tokens) {
    if (!isNaN(token)) {
      output.push(parseFloat(token));
    } else if (token in FUNCTIONS) {
      stack.push(token);
    } else if (token == ',') {
      while (stack.peek() != '(') {
        if (stack.empty()) return SYER;
        output.push(stack.pop());
      }
    } else if (token in OPERATORS) {
      let o1 = token;
      let o2;
      while (((o2 = stack.peek()) in OPERATORS) &&
        (((OPERATORS[o1].associativity == 'lr') && (OPERATORS[o1].precedence <= OPERATORS[o2].precedence)) ||
        ((OPERATORS[o1].associativity == 'rl') && (OPERATORS[o1].precedence < OPERATORS[o2].precedence)))) {
        output.push(stack.pop());
      }
      stack.push(o1);
    } else if (token == '(') {
      stack.push(token);
    } else if (token == ')') {
      while (stack.peek() != '(') {
        output.push(stack.pop());
      }
      stack.pop();
      if (stack.peek() in FUNCTIONS) {
        output.push(stack.pop());
      }
    }
  }

  while (stack.peek()) {
    if (stack.peek() == '(' || stack.peek() == ')') return SYER;
    output.push(stack.pop());
  }

  return output;
}

function solve(rpn) {
  let stack = [];
  for (let i = 0; i < rpn.length; ++i) {
    let token = rpn[i];
    if(!isNaN(token)) {
      stack.push(rpn.shift());
      --i;
    } else if (token in OPERATORS) {
      if(stack.length < OPERATORS[token].operate.length) {
        return ARER;
      } else {
        let args = [];
        for (let j = 0; j < OPERATORS[token].operate.length; j++) {
          args.push(stack.pop());
        }
        let result = OPERATORS[rpn.shift()].operate(...args);
        --i;
        stack.push(result);
      }
    }


  }

  switch (stack.length) {
    case 1: return stack.pop(); break;
    case 2: return ARER;        break;
  }
}

if (process.argv.length === 2) {
  console.error('Expected at least one argument!');
  process.exit(1);
}else {
  let p = parse(process.argv[2]);
  let s = solve(p);
  console.log(s);
}
