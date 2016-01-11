/* global __dirname */
var url = require("url");
var mysql = require("mysql");
var config = require("./config");
var routes = require("./routes");

//Mysql connection config
var connection = mysql.createConnection(config.mysqlConfig);
//Connect to the database

connection.connect();

var port = 3000;

routes(connection, port);