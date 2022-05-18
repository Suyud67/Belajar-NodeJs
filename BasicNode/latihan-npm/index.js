const _partition = require('./lodash/_apply'); // TODO

const myOddEvenArray = _partition([1, 2, 3, 4, 5, 6], (n) => n % 2);

console.log(myOddEvenArray);
