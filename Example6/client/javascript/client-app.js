var main = function () {
    "use strict";

    //Load items on page load
    var newTodoForm, updateForm, todoFormText;
    getItems();

    //On form submit, post the new item
    newTodoForm = $('#newTodoForm');
    newTodoForm.submit(function (ev) {
        $.ajax({
            type: newTodoForm.attr('method'),
            url: newTodoForm.attr('action'),
            data: newTodoForm.serialize(),
            success: function (data) {
                getItems();
            }
        });

        ev.preventDefault();
        document.getElementById('todoFormText').value = "";
    });

    updateForm = $('#updateForm');
    updateForm.submit(function (ev) {
        $.ajax({
            type: updateForm.attr('method'),
            url: updateForm.attr('action'),
            data: updateForm.serialize('message'),
            success: function (data) {
                getItems();
            }
        });

        ev.preventDefault();
    });
};

function addTodosToList (todos) {
    var li;
    var todolist;
    console.log("Loading todos from server");
    todolist = document.getElementById("todo-list");
    todolist.innerHTML = "";
    for (var key in todos) {
        li = document.createElement("li");
        li.innerHTML = "TODO: " + todos[key].message + "<button onclick='updateTodo()'></button>";
        todolist.appendChild(li);
    }
}

function getItems() {
    $.getJSON("../todos", addTodosToList)
        .error(function (jqXHR, textStatus, errorThrown) {
            console.log("error " + textStatus);
            console.log("incoming Text " + jqXHR.responseText);
        });
}

$(document).ready(main);