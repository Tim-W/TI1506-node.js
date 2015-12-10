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
                if (items[key]["done"] === false) {
                    li.innerHTML = "<input class='done' type='checkbox'/>";
                    li.innerHTML += "<span class='description'>" + items[key]["description"] + "</span>";
                } else {
                    li.innerHTML = "<input class='done' type='checkbox' checked='checked'/>";
                    li.innerHTML += "<span class='description' style='text-decoration: line-through'>" + items[key].description + "</span>";
                }
                li.innerHTML += " <button class='editTodo'>Edit</button>"
                li.innerHTML += " <button class='removeTodo'>Remove</button>"
                todoList.appendChild(li);
            }

            $(".editTodo").click(function () {
                var index = $(this).parent().index();
                var newDescription = prompt("Enter new description");

                $.ajax({
                    url: '/updatetodo',
                    data: {
                        listId: currentlySelectedList,
                        todoId: index,
                        description: newDescription
                    },
                    success: function () {
                        retrieveData();
                    }
                })
            });

            $(".removeTodo").click(function (event) {
                var index = $(this).parent().index();

                $.ajax({
                    url: '/removetodo',
                    data: {
                        listId: currentlySelectedList,
                        todoId: index
                    },
                    success: function () {
                        retrieveData();
                    }
                })
            });

            $(".done").change(function (event) {
                var index = $(this).parent().index();
                var done = $(this).is(':checked');
                //console.log({done: done});
                var description = items[index]["description"];

                console.log({
                    listId: currentlySelectedList,
                    todoId: index,
                    description: description,
                    done: done
                });

                $.ajax({
                    url: '/updatetodo',
                    data: {
                        listId: currentlySelectedList,
                        todoId: index,
                        description: description,
                        done: done
                    },
                    success: function () {
                        retrieveData();
                    }
                })
            });
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
            if (key == currentlySelectedList) {
                li.innerHTML = "<a href='#' class='todoListTitle' style='background: coral'>" + todoListList[key].listName + "</a>" +
                    " <button class='editList'>Edit</button> <button class='removeList'>Remove</button>";
            } else {
                li.innerHTML = "<a href='#' class='todoListTitle'>" + todoListList[key].listName + "</a>" +
                    " <button class='editList'>Edit</button> <button class='removeList'>Remove</button>";
            }
            listList.appendChild(li);
        }

        $(".todoListTitle").click(function (event) {
            event.preventDefault();
            currentlySelectedList = $(this).parent().index();
            retrieveData();
        });

        $(".editList").click(function (event) {
            event.preventDefault();
            var index = $(this).parent().index();
            var newListName = prompt('Change list name');
            $.ajax({
                url: '/updatelist',
                data: {
                    listId: index,
                    name: newListName
                },
                success: function () {
                    retrieveData();
                }
            });
        });

        $(".removeList").click(function (event) {
            event.preventDefault();
            var index = $(this).parent().index();
            $.ajax({
                url: '/removelist',
                data: {
                    listId: index
                },
                success: function () {
                    retrieveData();
                }
            });
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
                addTodosToList(data);
            }
        });
    }
};

$(document).ready(main);