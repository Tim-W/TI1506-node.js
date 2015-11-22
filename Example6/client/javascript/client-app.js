var main = function () {
	"use strict";

	var addTodosToList = function (todos) {
		console.log("Loading todos from server");
		var todolist = document.getElementById("todo-list");
		for (var key in todos) {
			var li = document.createElement("li");
			li.innerHTML = "TODO: " + todos[key].message;
			todolist.appendChild(li);
		}
	};
	$.getJSON("../todos", addTodosToList)
		.error(function (jqXHR, textStatus, errorThrown) {
			console.log("error " + textStatus);
			console.log("incoming Text " + jqXHR.responseText);
		});
};
$(document).ready(main);
