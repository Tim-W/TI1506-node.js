/* global __dirname */
var express = require("express");
var url = require("url");
var http = require("http");
var mysql = require("mysql");
var path = require("path");

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
TodoList = function (dbid, listName, items) {
    this.dbid = dbid;

    this.listName = listName;
    if (items) {
        this.items = items;
    } else {
        this.items = [];
    }
};

TodoList.prototype.getdbId = function() {
    return this.dbid;
};
TodoList.prototype.getItems = function () {
    return this.items;
};
TodoList.prototype.getListName = function () {
    return this.listName;
};
TodoList.prototype.setDbId = function (dbid) {
    return this.dbid = dbid;
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
 * @param id {int}
 * @param description {String}
 * @param priority {Boolean}
 * @param date {Date}
 * @param done {Boolean}
 * @constructor
 */
TodoItem = function (dbid, description, priority, date, done) {
    this.dbid = dbid
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
    } else if (done == 1){
        this.done = true;
    }
    else {
        this.done = false;
    }
};

TodoItem.prototype.getdbId = function () {
    return this.dbid;
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

TodoItem.prototype.setId = function (dbid) {
    return this.dbid = dbid
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
    connection.query("SELECT * FROM ToDoList WHERE Owner = "+userId, function (err, todoListRows) {
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
                    items.push(new TodoItem(todoItem["Id"],todoItem["Title"], priority, todoItem["DueDate"], todoItem["Completed"]));
                });
                todoListList.push(new TodoList(todoList["Id"], todoList["Name"], items));
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

    if (query["listId"] && query["description"]) {
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
            var tempDate = new Date(query["date"])
            date = tempDate.toISOString().slice(0, 19).replace('T', ' ');
        }
        //var item = new TodoItem(query["description"], priority, query["date"], query["done"]);
        //todoListList[query["listId"]].addItem(item);
        connection.query("INSERT INTO ToDoItem (Title, CreationDate, Priority, DueDate, Completed, ToDoListID) VALUES ('" + query["description"] + "',NOW() ,'" + priority + "','" + date + "','" + completed + "','" + query["listId"] + "')");
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

    if (query["listId"] && query["todoId"]) {
        var listId = query["listId"] + 1;
        var todoId = query["todoId"];
        var todoDBId = query["todoDBId"];
        var description = query["description"];
        var priority = query["priority"];
        var date = query["date"];
        var done = query["done"];
        if (!description) {
            description = "No description";
        }
        if (priority) {
            if(priority == "false") {
                priority = 1;
            } else {
                priority = 3;
            }
        } else {
            priority = 1;
        }
        if (date) {
            date = date.toISOString().slice(0, 19).replace('T', ' ');
        } else {
            date = "NULL";
        }
        if (done == 'false') {
            done = 0;
            connection.query("UPDATE ToDoItem SET Title = '" + description + "', Completed = '"+done+"', CompletionDate = NULL WHERE Id = "+todoDBId);
        }
        else if (done == 'true') {
            done = 1;
            connection.query("UPDATE ToDoItem SET Title = '" + description + "', Completed = '"+done+"', CompletionDate = NOW() WHERE Id = "+todoDBId);
        }
        else{
            connection.query("UPDATE ToDoItem SET Title = '" + description + "' WHERE Id = "+todoDBId);
        }
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove item
app.get("/removetodo", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && query["todoId"]) {
        todoListList[query["listId"]].delItem(query["todoId"]);
        var todoDBId = query["todoDBId"];
        connection.query("DELETE FROM ToDoItem WHERE Id = '"+todoDBId+"'");
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
        connection.query("INSERT INTO ToDoList (Name, CreationDate, Owner, IsPublic) VALUES ('"+ query['name'] +"', NOW(), 1, 0)");
        todoListList.push(list);
        res.end("success");
    } else {
        res.end("error");
    }
});

//get list
app.get("/getlist", function (req, res) {
    var query = url.parse(req.url, true).query;
    if (query["listId"]) {
        var items = [];
        //Then, load all items and create relation between lists and items
        connection.query("SELECT Id, Title, DueDate, Completed, Priority FROM ToDoItem WHERE TodoListID = " + query['listId'], function (err, todoItemRows) {
            todoItemRows.forEach(function (todoItem) {
                var priority = false;
                if (todoItem["Priority"] > 1) {
                    priority = true;
                }
                items.push(new TodoItem(todoItem["Id"],todoItem["Title"], priority, todoItem["DueDate"], todoItem["Completed"]));
            });
            //If this is the last list, send the items to the client as JSON
            res.json(items);
        });
    } else {
        res.end("error");
    }
});

//update list
app.get("/updatelist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"] && query["name"]) {
        connection.query("UPDATE ToDoList SET Name = '"+query['name']+"' WHERE Id = '"+query['listId']+"'");
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove list
app.get("/removelist", function (req, res) {
    var query = url.parse(req.url, true).query;

    if (query["listId"]) {
        connection.query("DELETE FROM ToDoList  WHERE Id = '"+query['listId']+"'");
        res.end("success");
    } else {
        res.end("error");
    }
});

//remove list
app.get("/dashboard", function (req, res) {
    res.sendFile(path.join(__dirname, '/../client', 'dashboard.html'));
});

app.get("/countTodoItem", function (req, res) {
    connection.query("SELECT COUNT(*) as amount FROM ToDoItem;", function (err, rows) {
        res.json(rows);
    })
});

app.get("/countTodoList", function (req, res) {
    connection.query("SELECT COUNT(*) as amount FROM ToDoList;", function (err, rows) {
        res.json(rows)
    })
});

app.get("/countTodoListByOwner", function (req, res) {
    connection.query("SELECT Name, COUNT(*) as amount FROM ToDoList GROUP BY Owner;", function (err, rows) {
        res.json(rows)
    })
});

//The average completion for all todoItems
app.get("/avgCompletionTime", function (req, res) {
    connection.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) as avgCompletionTime FROM ToDoItem WHERE Completed = 1;", function (err, rows) {
        res.json(rows)
    })
});

//The todoItem that took the shortest to complete
app.get("/minCompletionTime", function (req, res) {
    connection.query("SELECT MIN(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) as minCompletionTime FROM ToDoItem WHERE Completed = 1;", function (err, rows) {
        res.json(rows)
    })
});

//The todoItem that took the longest to complete
app.get("/maxCompletionTime", function (req, res) {
    connection.query("SELECT MAX(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) as maxCompletionTime FROM ToDoItem WHERE Completed = 1;", function (err, rows) {
        res.json(rows)
    })
});

//The todoItem which has the closest due date from now
app.get("/newestTodo", function (req, res) {
    connection.query("SELECT *, TIMESTAMPDIFF(MINUTE, NOW(), DueDate) as timeDiff FROM ToDoItem  WHERE Completed = 0 GROUP BY timeDiff HAVING MIN(timeDiff) AND timeDiff >=0;", function (err, rows) {
        res.json(rows);
    })
});

//Amount of todoItems that are completed and amount that are not completed
app.get("/amountCompletedNotCompleted", function (req, res) {
    connection.query("SELECT SUM(CASE WHEN ToDoItem.Completed >= 1 THEN 1 ELSE 0 END) as Completed, SUM(CASE WHEN Completed = 0 THEN 1 ELSE 0 END) as notCompleted FROM ToDoItem;", function (err, rows) {
        res.json(rows);
    })
})

//The amount of todoItems that are completed and amount that are not completed
app.get("/amountPriorityNoPriority", function (req, res) {
    connection.query("SELECT SUM(CASE WHEN Priority >= 1 THEN 1 ELSE 0 END) as priority, SUM(CASE WHEN Priority = 0 THEN 1 ELSE 0 END) as notPriority FROM ToDoItem;", function (err, rows) {
        res.json(rows);
    })
})

//The average completion time of the todoItems per todoList
app.get("/avgCompletionTimePerList", function (req, res) {
    connection.query("SELECT ToDoListID, AVG(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) as avgTime FROM ToDoItem WHERE Completed = 1 GROUP BY ToDoListID;", function (err, rows) {
        res.json(rows)
    })
})