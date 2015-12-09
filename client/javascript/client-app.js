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

    //Adds a new list
    var addListForm = $('#addListForm');
    addListForm.submit(function (event) {
        $.ajax({
            url: addListForm.attr('action'),
            data: addListForm.serialize(),
            success: function () {
                retrieveData();
            }
        });

        event.preventDefault();
        document.getElementById('listName').value = "";
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
        var li, todoList;
        todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";
        //Only render the items on the screen if the list actually has one or more items
        if (todoListList && todoListList.items) {
            var items = todoListList.items;

            for (var key in items) {
                li = document.createElement("li");
                li.innerHTML = items[key]["description"];
                todoList.appendChild(li);
            }
        }
    }

    function addLists(todoListList) {
        var li;
        var todoList, listList;
        console.log("Loading todos from server");
        listList = document.getElementById("list-list");
        listList.innerHTML = "";
        for (var key in todoListList) {
            li = document.createElement("li");
            li.innerHTML = "<a href='#' class='todoListTitle'>" + todoListList[key].listName + "</a>";
            listList.appendChild(li);
        }

        $(".todoListTitle").click(function (event) {
            event.preventDefault();
            currentlySelectedList = $("li").index(this);
            retrieveData();
            console.log($("a").index(this));
        });
    }

    function retrieveData() {
        $.getJSON("/getlists", addLists)
            .error(function (jqXHR, textStatus) {
                console.log("error " + textStatus);
                console.log("incoming Text " + jqXHR.responseText);
            });

        $.ajax({
            dataType: "json",
            url: '/getlist',
            data: {
                listId: currentlySelectedList
            },
            error: function (error) {
                console.log(error);
            },
            success: function (data) {
                console.log(JSON.stringify(data));
                addTodosToList(data)
            }
        });
    }
};

$(document).ready(main);