var TextSizeCookie;

var main = function () {
    "use strict";

    var currentlySelectedList = 1;

    //Load items on page load
    var newTodoForm, updateForm, todoFormText;
    retrieveData();

    //On form submit, post the new item
    newTodoForm = $('#newTodoForm');
    newTodoForm.submit(function (ev) {
        $.ajax({
            url: newTodoForm.attr('action'),
            data: {
                description: $('input[name="description"]').val(),
                date: new Date($('input[name="date"]').val()),
                priority: $('input[name="priority"]:checked').val(),
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

    function addTodosToList(items) {
        var li, todoList, date, priority;
        todoList = document.getElementById("todoList");
        todoList.innerHTML = "";
        //Only render the items on the screen if the list actually has one or more items
            for (var key in items) {
                li = document.createElement("div");
                li.class = "todoListItem";
                if (items[key]["done"] === false) {
                    li.innerHTML = "<input class='done' type='checkbox' value='"+items[key].dbid+"'/>";
                    li.innerHTML += "<span class='description'>" + items[key]["description"] + "</span>";
                } else {
                    li.innerHTML = "<input class='done' type='checkbox' checked='checked' value='"+items[key].dbid+"'/>";
                    li.innerHTML += "<span class='description' style='text-decoration: line-through'>" + items[key].description + "</span>";
                }
                if (items[key].date != "Invalid Date") {
                    date = new Date(items[key].date);
                    date = date.toLocaleDateString();
                }
                else {
                    date = "";
                }

                priority = items[key].priority ? "priority" : "";
                li.innerHTML += "<div class='rightThingies'><span style='font-style: italic;'>" +
                    date + "</span>  <span id='priority'>" + priority +
                    "</span>  <button class='editTodo' value='"+items[key].dbid+"'>Edit</button>" +
                    "<button class='removeTodo' value='"+items[key].dbid+"'>Remove</button></div>";
                todoList.appendChild(li);
            }
            priority = items[key].priority ? "priority" : "";
            li.innerHTML += "<div class='rightThingies'><span style='font-style: italic;'>" +
                date + "</span>  <span id='priority'>" + priority +
                "</span>  <button class='editTodo' value='" + items[key].dbid + "'>Edit</button>" +
                "<button class='removeTodo' value='" + items[key].dbid + "'>Remove</button>";
            todoList.appendChild(li);

            //Update the styles using cookies for user preference
            if (Cookies.get("textSize")) {
                TextSizeCookie = Cookies.get("textSize");
                $("#todoList").find("div").css("font-size", TextSizeCookie + "px");
                $("#todoList").find("div").css("height", TextSizeCookie * 2);
            }
        }

        $(".editTodo").click(function () {
            var index = $(this).parent().parent().index();
            var newDescription = prompt("Enter new description");

            $.ajax({
                url: '/updatetodo',
                data: {
                    listId: currentlySelectedList,
                    todoId: index,
                    todoDBId: $(this).val(),
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
                    todoId: index,
                    todoDBId: $(this).val()
                },
                success: function () {
                    retrieveData();
                }
            })
        });

        $(".done").change(function (event) {
            var index = $(this).parent().index();
            var done = $(this).is(':checked');
            console.log({doner: done});
            var description = items[index]["description"];

            console.log({
                listId: currentlySelectedList,
                todoId: index,
                todoDBId: $(this).val(),
                description: description,
                done: done
            });

            $.ajax({
                url: '/updatetodo',
                data: {
                    listId: currentlySelectedList,
                    todoId: index,
                    todoDBId: $(this).val(),
                    description: description,
                    done: done
                },
                success: function () {
                    retrieveData();
                }
            })
        });
    }

    function addLists(todoListList) {
        var li;
        var todoList, listList;
        console.log("Loading todos from server");
        listList = document.getElementById("list-list");
        listList.innerHTML = "";
        for (var key in todoListList) {
            li = document.createElement("li");
            if (todoListList[key].dbid == currentlySelectedList) {
                li.id = 'selectedList';
                li.innerHTML = "<a href='#' data-id='" + todoListList[key].dbid + "' class='todoListTitle'><span>" + todoListList[key].listName + "</span></a>" +
                    "<button class='editList'>Edit</button> <button class='removeList'>Remove</button>";
            } else {
                li.innerHTML = "<a href='#' data-id='" + todoListList[key].dbid + "' class='todoListTitle'><span>" + todoListList[key].listName + "</span></a>" +
                    "<button class='editList' value='" + todoListList[key].dbid + "'>Edit</button> <button class='removeList' value='" + todoListList[key].dbid + "'>Remove</button>";
            }
            listList.appendChild(li);
        }

        li = document.createElement("li");
        li.id = 'addList';
        li.innerHTML = "<a href='#'><span>+ add list</span></a>";
        listList.appendChild(li);

        $(".todoListTitle").click(function (event) {
            event.preventDefault();
            console.log("data-id: " + $(this).attr("data-id"));
            currentlySelectedList = $(this).attr("data-id");
            retrieveData();
        });

        $("#addList").click(function (event) {
            event.preventDefault();
            var index = $(this).val();
            var newListName = prompt('New list name');
            $.ajax({
                url: '/addlist',
                data: {
                    listId: index,
                    name: newListName
                },
                success: function () {
                    retrieveData();
                }
            });
            event.preventDefault();
        });


        $(".editList").click(function (event) {
            event.preventDefault();
            var index = $(this).val();
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
            var index = $(this).val();
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
        $.getJSON("/getlists", function (data) {
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
                addLists(data);
            })
            .error(function (jqXHR, textStatus) {
                console.log("error " + textStatus);
                console.log("incoming Text " + jqXHR.responseText);
            });
    }
};

$(document).ready(main);