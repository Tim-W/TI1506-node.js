var main = function () {
    "use strict";

    var currentlySelectedList = 0;

    //Load items on page load
    var newTodoForm, updateForm, todoFormText;
    retrieveData();

    //On form submit, post the new item
    newTodoForm = $('#newTodoForm');
    newTodoForm.submit(function (ev) {
        $.ajax({
            type: newTodoForm.attr('method'),
            url: newTodoForm.attr('action'),
            data: {
                description: $('#todoFormText').val(),
                listId: currentlySelectedList
            },
            success: function (data) {
                retrieveData();
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
                retrieveData();
            }
        });

        ev.preventDefault();
        document.getElementById('todoFormText').value = "";
    });

    function addTodosToList(todoListList) {
        var li;
        var todoList, listList;
        console.log("Loading todos from server");
        listList = document.getElementById("list-list");
        listList.innerHTML = "";
        for (var key in todoListList) {
            li = document.createElement("li");
            li.innerHTML = todoListList[key].listName;
            listList.appendChild(li);
        }

        todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";
        var items = todoListList[currentlySelectedList].items;

        for (var key in items) {
            li = document.createElement("li");
            li.innerHTML = items[key]["description"];
            todoList.appendChild(li);
        }
    }

    function retrieveData() {
        $.getJSON("../todos", addTodosToList)
            .error(function (jqXHR, textStatus) {
                console.log("error " + textStatus);
                console.log("incoming Text " + jqXHR.responseText);
            });
    }

    function selectList(id) {
        currentlySelectedList = id;
        retrieveData();
    }
};

$(document).ready(main);