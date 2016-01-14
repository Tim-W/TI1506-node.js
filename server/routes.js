var http = require("http");
var express = require("express");
var TodoItem = require("./TodoItem");
var TodoList = require("./TodoList");
var path = require("path");
var url = require("url");
var passport = require("passport");
var FacebookStrategy = require('passport-facebook').Strategy
/**
 * Creates the routes
 * @param connection - the MySQL connection to the database
 * @param port - the port the app should listen on
 */
module.exports = function (connection, port) {
    //The user is hardcoded, therefore we set the user ID to 1 for the time being
    var userId = 1;
    var todoListList = [];
    var app = express();

    app.use(express.static(__dirname + "/../client"));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new FacebookStrategy({
            clientID: "1009972232409748",
            clientSecret: "6e7f19b58ac188c5d54274420c2e5772",
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            enableProof: false,
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'photos', 'likes']
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                console.log(profile);
                connection.query("INSERT INTO ToDoList(Name, Owner, CreationDate, IsPublic) VALUES ('Inbox', '" + profile.id + "', NOW(), 0)", function () {
                    connection.query("INSERT INTO User(Id, Name, Email, Username, Password) VALUES ('" + profile.id + "', '" + profile.displayName + "', 'default email', 'default username', 'default password')", function () {
                        return done(null, profile);
                    });
                });
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook'), function (req, res) {

        });

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {failureRedirect: '/'}),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/app?userId=' + req.user.id);
        });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.engine('html', require('ejs').renderFile);
    app.listen(port);

    app.set("views", __dirname + "/../client");
    app.set("view engine", "ejs");

    app.get("/apptest", function (req, res) {
        var query = url.parse(req.url, true).query;
        var items = [];
        var todoListList = [];
        var todoListID;
        connection.query("SELECT * FROM ToDoList WHERE Owner = " + query["userId"], function (err, todoListRows) {
            if (todoListRows[0]) {
                todoListID = todoListRows[0]["Id"];
                todoListRows.forEach(function (todoList, index) {
                    todoListList.push(new TodoList(todoList["Id"], todoList["Name"], items));
                    connection.query("SELECT Id, Title, DueDate, Completed, Priority FROM ToDoItem WHERE TodoListID = " + todoListID + "", function (err, todoItemRows) {
                        todoItemRows.forEach(function (todoItem, index2) {
                            var priority = false;

                            if (todoItem["Priority"] > 1) {
                                priority = true;
                            }

                            if (index == 0) {
                                items.push(new TodoItem(todoItem["Id"], todoItem["Title"], priority, todoItem["DueDate"], todoItem["Completed"]));
                            }

                            //send data
                            if (index == todoListRows.length - 1 && index2 == todoItemRows.length - 1) {
                                res.render("app", {list_array: todoListList, todo_array: items});
                            }
                        });
                    });
                });
            }
        });
    });

    //clients requests todos
    app.get("/getlists", function (req, res) {
        var query = url.parse(req.url, true).query;
        console.log(query);
        todoListList = [];
        //On start of application, load all todoItems and lists
        //First, load all lists
        connection.query("SELECT * FROM ToDoList WHERE Owner = " + query['userId'], function (err, todoListRows) {
            if (todoListRows) {

                todoListRows.forEach(function (todoList, index) {
                    var items = [];
                    //Then, load all items and create relation between lists and items
                    connection.query("SELECT Id, Title, DueDate, Completed, Priority FROM ToDoItem WHERE TodoListID = " + todoList["Id"], function (err, todoItemRows) {
                        todoItemRows.forEach(function (todoItem) {
                            var priority = false;
                            if (todoItem["Priority"] > 1) {
                                priority = true;
                            }
                            items.push(new TodoItem(todoItem["Id"], todoItem["Title"], priority, todoItem["DueDate"], todoItem["Completed"]));
                        });
                        todoListList.push(new TodoList(todoList["Id"], todoList["Name"], items));
                        //If this is the last list, send the items to the client as JSON

                        if (index == (todoListRows.length - 1)) {
                            res.json(todoListList)
                        }
                    });
                });
            }
        });

    });

//add item
    app.get("/addtodo", function (req, res) {
        var query = url.parse(req.url, true).query;

        if (query["listId"] && query["description"]) {
            var priority = 1;
            var completed = 0;
            var date = "NULL";
            if (query["priority"] == "priority") {
                priority = 2;
            }
            if (query["done"]) {
                completed = 1;
            }
            if (query["date"] != "Invalid Date") {
                var tempDate = new Date(query["date"]);
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
                if (priority == "false") {
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
                connection.query("UPDATE ToDoItem SET Title = '" + description + "', Completed = '" + done + "', CompletionDate = NULL WHERE Id = " + todoDBId);
            }
            else if (done == 'true') {
                done = 1;
                connection.query("UPDATE ToDoItem SET Title = '" + description + "', Completed = '" + done + "', CompletionDate = NOW() WHERE Id = " + todoDBId);
            }
            else {
                connection.query("UPDATE ToDoItem SET Title = '" + description + "' WHERE Id = " + todoDBId);
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
            //todoListList[query["listId"]].delItem(query["todoId"]);
            var todoDBId = query["todoDBId"];
            connection.query("DELETE FROM ToDoItem WHERE Id = '" + todoDBId + "'");
            res.end("success");
        } else {
            res.end("error");
        }
    });

//add list
    app.get("/addlist", function (req, res) {
        var query = url.parse(req.url, true).query;
        var userId = query.userId;

        if (query["name"]) {
            var list = new TodoList(query["name"], []);
            connection.query("INSERT INTO ToDoList (Name, CreationDate, Owner, IsPublic) VALUES ('" + query['name'] + "', NOW(), '" + query['userId'] + "', 0)");
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
                    items.push(new TodoItem(todoItem["Id"], todoItem["Title"], priority, todoItem["DueDate"], todoItem["Completed"]));
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
            connection.query("UPDATE ToDoList SET Name = '" + query['name'] + "' WHERE Id = '" + query['listId'] + "'");
            res.end("success");
        } else {
            res.end("error");
        }
    });

//remove list
    app.get("/removelist", function (req, res) {
        var query = url.parse(req.url, true).query;

        if (query["listId"]) {
            connection.query("DELETE FROM ToDoList  WHERE Id = '" + query['listId'] + "'");
            res.end("success");
        } else {
            res.end("error");
        }
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
    });

//The amount of todoItems that are completed and amount that are not completed
    app.get("/amountPriorityNoPriority", function (req, res) {
        connection.query("SELECT SUM(CASE WHEN Priority >= 1 THEN 1 ELSE 0 END) as priority, SUM(CASE WHEN Priority = 0 THEN 1 ELSE 0 END) as notPriority FROM ToDoItem;", function (err, rows) {
            res.json(rows);
        })
    });

//The average completion time of the todoItems per todoList
    app.get("/avgCompletionTimePerList", function (req, res) {
        connection.query("SELECT ToDoListID, AVG(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) as avgTime FROM ToDoItem WHERE Completed = 1 GROUP BY ToDoListID;", function (err, rows) {
            res.json(rows)
        })
    });

    ////Static routes
    //app.get("/app", passport.authenticate('google', {failureRedirect: '/', scope: 'https://www.googleapis.com/auth/plus.login'}), function (req, res) {
    //    res.sendFile(path.join(__dirname, '/../client', 'app.html'));
    //});

    //app.get('', function(req, res, next) {
    //    if (!req.user) { // Not already logged in, probably okay to try to hit the oauth provider
    //        return next();
    //    }
    //    res.redirect('/');
    //    //res.sendFile(path.join(__dirname, '/../client', 'app.html'));
    //}, passport.authenticate('google', {
    //    scope: 'https://www.googleapis.com/auth/plus.login'
    //}));

    //Redirect the user if the URL is spelled wrong
    app.get("/ap*", function (req, res, next) {
        var userID = url.parse(req.url, true).query.userId;
        res.sendFile(path.join(__dirname, '/../client', 'app.html'));
    });

    app.get("/dash*", function (req, res) {
        res.sendFile(path.join(__dirname, '/../client', 'dashboard.html'));
    });

    app.get("/ejs", function (req, res) {
        res.render("ejs");
    });
};