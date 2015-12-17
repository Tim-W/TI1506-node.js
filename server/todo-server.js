/* global __dirname */
var express = require("express");
var url = require("url");
var http = require("http");
var mysql = require("mysql");
var step = require("step");

var userId = 1;

//Mysql connection config
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo"
});
//Connect to the database

connection.connect();

var port = 3000;
var app = express();
app.use(express.static(__dirname + "/../client"));
http.createServer(app).listen(port);

/**
 * A list of TodoItems.
 * @param listName {String}
 * @param items {Array}
 * @constructor
 */
TodoList = function (listName, items) {
    this.listName = listName;
    if (items) {
        this.items = items;
    } else {
        this.items = [];
    }
};

TodoList.prototype.getItems = function () {
    return this.items;
};
TodoList.prototype.getListName = function () {
    return this.listName;
};
TodoList.prototype.setListName = function (listName) {
    return this.listName = listName;
};
TodoList.prototype.getItems = function (items) {
    return this.items = items;
};
/**
 * Add an item to the list
 * @param todoItem {TodoItem}
 * @returns {*|Number}
 */
TodoList.prototype.addItem = function (todoItem) {
    return this.items.push(todoItem);
};
/**
 * Get an item from the list
 * @param index {Number}
 * @returns {TodoItem}
 */
TodoList.prototype.getItem = function (index) {
    return this.items[index];
};
/**
 * Remove an item from the list
 * @param index
 * @returns {*|Array.<TodoItem>}
 */
TodoList.prototype.delItem = function (index) {
    return this.items.splice(index, 1);
};
/**
 * Update an item from the list
 * @param index {Number}
 * @param todoItem {TodoItem}
 * @returns {*}
 */
TodoList.prototype.updateItem = function (index, todoItem) {
    return this.items[index] = todoItem;
};

/**
 * A TodoItem, part of a TodoList
 * @param description {String}
 * @param priority {Boolean}
 * @param date {Date}
 * @param done {Boolean}
 * @constructor
 */
TodoItem = function (description, priority, date, done, Id) {
    this.description = description;
    if (priority) {
        this.priority = priority;
    } else {
        this.priority = false;
    }
    if (date) {
        this.date = date;
    }
    if (done == "true") {
        this.done = true;
    } else {
        this.done = false;
    }
    if (id) {
        this.id = id;
    }
};

TodoItem.prototype.getDescription = function () {
    return this.description;
};
TodoItem.prototype.getPriority = function () {
    return this.priority;
};
TodoItem.prototype.getDate = function () {
    return this.date;
};
TodoItem.prototype.getDone = function () {
    return this.done;
};

TodoItem.prototype.setDescription = function (description) {
    return this.description = description;
};
TodoItem.prototype.setPriority = function (priority) {
    return this.priority = priority;
};
TodoItem.prototype.setDate = function (date) {
    return this.date = date;
};
TodoItem.prototype.setDone = function (done) {
    return done == "false" ? this.done = false : this.done = true;
};

var todoListList = [];

//clients requests todos
app.get("/getlists", function (req, res) {
    todoListList = [];
    //On start of application, load all todoItems and lists
    //First, load all lists
    connection.query("SELECT * FROM ToDoList", function (err, todoListRows) {
        var i = 0;
        todoListRows.forEach(function (todoList, index) {
            var items = [];
            //Then, load all items and create relation between lists and items
            connection.query("SELECT Id, Title, DueDate, Completed, Priority FROM ToDoItem WHERE TodoListID = " + todoList["Id"], function (err, todoItemRows) {
                todoItemRows.forEach(function (todoItem) {
                    var priority = false;
                    if (todoItem["Priority"] > 1) {
                        priority = true;
                    }
                    items.push(new TodoItem(todoItem["Title"], priority, todoItem["DueDate"], todoItem["Done"]), todoItem["Id"]);
                });
                todoListList.push(new TodoList(todoList["Name"], items));
                console.log(index, todoListRows.length);
                //If this is the last list, send the items to the client as JSON

                if(index == (todoListRows.length - 1)) {
                    res.json(todoListList)
                }
            });
        });
    });

});

//add item
app.get("/addtodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && query["description"] && todoListList[query["listId"]]) {
        query["listId"]++;
        var priority = 1;
        var completed = 0;
        var date = "NULL";
        if(query["priority"] == "priority") {
            priority = 2;
        }
        if(query["done"]) {
            completed = 1;
        }
        if(query["date"] != "Invalid Date") {
            date = query["date"].toISOString().slice(0, 19).replace('T', ' ');
        }
        //var item = new TodoItem(query["description"], priority, query["date"], query["done"]);
        //todoListList[query["listId"]].addItem(item);
        connection.query("INSERT INTO ToDoItem (Title, Priority, DueDate, Completed, ToDoListID) VALUES ('" + query["description"] + "','" + priority + "','" + date + "','" + completed + "','" + query["listId"] + "')");
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove item
app.get("/gettodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && query["todoId"] && todoListList[query["listId"]].getItem(query["todoId"])) {
        var item = todoListList[query["listId"]].getItem(query["todoId"]);
        res.json(item);
    } else {
        res.end("error");
    }
});

//update item
app.get("/updatetodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && query["todoId"] && todoListList[query["listId"]].getItem(query["todoId"])) {
        var listId = query["listId"] + 1;
        var todoId = query["todoId"];
        var description = query["description"];
        var priority = query["priority"];
        var date = query["date"];
        var done = query["done"];
        var todoItem = todoListList[query["listId"]].getItem(query["todoId"]);
        if (!description) {
            description = "No description";
        }
        if (priority) {
            if(priority == "false") {
                priority = 1;
            } else {
                priority = 3;
            }
            todoItem.setPriority(priority);
        } else {
            priority = 1;
        }
        if (date) {
            date = date.toISOString().slice(0, 19).replace('T', ' ');
        } else {
            date = "NULL";
        }
        if (done) {
            done = 1;
        } else {
            done = 0;
        }
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove item
app.get("/removetodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && query["todoId"] && todoListList[query["listId"]].getItem(query["todoId"])) {
        todoListList[query["listId"]].delItem(query["todoId"]);
        res.end("success");
    } else {
        res.end("error");
    }
});

//add list
app.get("/addlist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["name"]) {
        var list = new TodoList(query["name"], []);
        todoListList.push(list);
        res.end("success");
    } else {
        res.end("error");
    }
});

//get list
app.get("/getlist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && todoListList[query["listId"]]) {
        res.json(todoListList[query["listId"]]);
    } else {
        res.end("error");
    }
    res.end();
});

//update list
app.get("/updatelist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && todoListList[query["listId"]] && query["name"]) {
        todoListList[query["listId"]].setListName(query["name"]);
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove list
app.get("/removelist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && todoListList[query["listId"]]) {
        todoListList.splice(query["listId"], 1);
        res.end("success");
    } else {
        res.end("error");
    }
});