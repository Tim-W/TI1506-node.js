/* global __dirname */
var express = require("express");
var url = require("url");
var http = require("http");

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
    if(items) {
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
TodoItem = function (description, priority, date, done) {
    this.description = description;
    if(priority) {
        this.priority = priority;
    } else {
        this.priority = false;
    }
    if(date) {
        this.date = date;
    }
    if(done == "true") {
        this.done = true;
    } else {
        this.done = false;
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
    return this.done = done;
};

var exampleTodos = [
    new TodoItem('NKIR', false, new Date("2015-12-12"), false),
    new TodoItem('Calculus', false, new Date("2015-12-17"), false),
    new TodoItem('Assignment 3&4', true, new Date("2015-12-17"), true)
];
var exampleList = new TodoList('Inbox', exampleTodos);
var todoListList = [exampleList];

//clients requests todos
app.get("/getlists", function (req, res) {
	res.json(todoListList);
});

//add item
app.get("/addtodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if(query["listId"] && query["description"] && todoListList[query["listId"]]) {
        var priority = query["priority"] == "priority";
        var item = new TodoItem(query["description"], priority, query["date"], query["done"]);
        todoListList[query["listId"]].addItem(item);
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove item
app.get("/gettodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if(query["listId"] && query["todoId"] && todoListList[query["listId"]].getItem(query["todoId"])) {
        var item = todoListList[query["listId"]].getItem(query["todoId"]);
        res.json(item);
    } else {
        res.end("error");
    }
});

//update item
app.get("/updatetodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if(query["listId"] && query["todoId"] && query["description"] && todoListList[query["listId"]].getItem(query["todoId"])) {
        var item = new TodoItem(query["description"], query["priority"], query["date"], query["done"]);
        todoListList[query["listId"]].updateItem(query["todoId"], item);
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove item
app.get("/removetodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if(query["listId"] && query["todoId"] && todoListList[query["listId"]].getItem(query["todoId"])) {
        todoListList[query["listId"]].delItem(query["todoId"]);
        res.end("success");
    } else {
        res.end("error");
    }
});

//add list
app.get("/addlist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if(query["name"]) {
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

    if(query["listId"] && todoListList[query["listId"]]) {
        res.json(todoListList[query["listId"]]);
    } else {
        res.end("error");
    }
});

//update list
app.get("/updatelist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if(query["listId"] && todoListList[query["listId"]] && query["name"]) {
        todoListList[query["listId"]].setListName(query["name"]);
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove list
app.get("/removelist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if(query["listId"] && todoListList[query["listId"]]) {
        todoListList.splice(query["listId"], 1);
        res.end("success");
    } else {
        res.end("error");
    }
});