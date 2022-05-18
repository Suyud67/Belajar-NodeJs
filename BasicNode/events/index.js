// TODO 1
const { EventEmitter } = require('events');

const birthdayEventListener = ({ name, umur }) => {
  console.log(`Happy birthday ${name}!, sekarang umur kamu ${umur}`);
};

// TODO 2
const myEmitter = new EventEmitter();

// TODO 3
myEmitter.on('birthday', birthdayEventListener);
// TODO 4
myEmitter.emit('birthday', { name: 'suyud', umur: 21 });
