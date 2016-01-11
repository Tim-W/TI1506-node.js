/**
 * Created by timwissel on 11-01-16.
 */
/**
 * A list of TodoItems.
 * @param listName {String}
 * @param items {Array}
 * @constructor
 */
module.exports = TodoList = function (dbid, listName, items) {
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