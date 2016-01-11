/**
 * A TodoItem, part of a TodoList
 * @param id {int}
 * @param description {String}
 * @param priority {Boolean}
 * @param date {Date}
 * @param done {Boolean}
 * @constructor
 */
module.exports = TodoItem = function (dbid, description, priority, date, done) {
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