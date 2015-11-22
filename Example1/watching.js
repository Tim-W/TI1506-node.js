const fs = require('fs');
fs.watch('todos.txt', function () {
	console.log("File changed!");
});

console.log("Now watching 'todos.txt'");
