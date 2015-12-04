var main = function () {
    "use strict";

    //Load items on page load
    getItems();

    //On form submit, post the new item
    $('#newTodoForm').submit(function (ev) {
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize('message'),
            success: function (data) {
                getItems();
            }
        });

        ev.preventDefault();
    });
};

function addTodosToList (todos) {
    console.log("Loading todos from server");
    var todolist = document.getElementById("todo-list");
    todolist.innerHTML = "";
    for (var key in todos) {
        var li = document.createElement("li");
        li.innerHTML = "TODO: " + todos[key].message;
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