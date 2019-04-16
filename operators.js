global.OPERATORS = {
  '^':	{ precedence: 4,	associativity: 'rl', operate: (a, b) => Math.pow(b, a) },
  '*':	{ precedence: 3,	associativity: 'lr', operate: (a, b) => a * b          },
  '/':	{ precedence: 3,	associativity: 'lr', operate: (a, b) => a / b          },
  '+':	{ precedence: 2,	associativity: 'lr', operate: (a, b) => a + b          },
  '-':	{ precedence: 2,	associativity: 'lr', operate: (a, b) => a - b          }
};
