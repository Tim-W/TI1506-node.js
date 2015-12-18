/**
 * Get all data from server
 */
function getData() {
    var amountTodoItems;
    var amountLists;
    var amountListsByOwner;
    var avgCompletionTime;
    var minCompletionTime;
    var maxCompletionTime, newestTodo, amountCompletedNotCompleted, amountPriorityNoPriority, avgCompletionTimePerList;

    $.getJSON("/countTodoItem", function (data) {
        amountTodoItems = data[0]["amount"];
        console.log("amount todo items:" + JSON.stringify(data));
        $("#amountTodoItems").text(amountTodoItems);
    });

    $.getJSON("/countTodoList", function (data) {
        amountLists = data[0]["amount"]
        console.log("amount todo lists:" + JSON.stringify(data));
        $("#amountLists").text(amountLists);
    });

    $.getJSON("/countTodoListByOwner", function (data) {
        amountListsByOwner = data;
        $("#amountListsByOwner").empty();
        data.forEach(function (list) {
            $("#amountListsByOwner").append("<li>" + list['Name'] + ": " + list['amount'] + "</li>")
        });
        console.log("amount todo lists by owner:" + JSON.stringify(data));
    });

    $.getJSON("/avgCompletionTime", function (data) {
        avgCompletionTime = data[0]["avgCompletionTime"];
        $("#avgCompletionTime").text(avgCompletionTime / 60 + " hours");
        console.log("Average completion time:" + avgCompletionTime);
    });

    $.getJSON("/minCompletionTime", function (data) {
        minCompletionTime = data[0]["minCompletionTime"];
        $("#minCompletionTime").text(minCompletionTime / 60 + " hours");
        console.log("Min completion time:" + minCompletionTime + " minutes");
    });

    $.getJSON("/maxCompletionTime", function (data) {
        maxCompletionTime = data[0]["maxCompletionTime"]
        $("#maxCompletionTime").text(maxCompletionTime / 60 + " hours");
        console.log("Max completion time:" + maxCompletionTime + " minutes");
    });

    $.getJSON("/newestTodo", function (data) {
        newestTodo = data;
        console.log("Newest todo:" + JSON.stringify(newestTodo));
    });

    $.getJSON("/amountCompletedNotCompleted", function (data) {
        amountCompletedNotCompleted = data;
        $("#completed").text(amountCompletedNotCompleted[0]["Completed"])
        $("#notCompleted").text(amountCompletedNotCompleted[0]["notCompleted"])
        console.log("Amount completed & not completed: " + JSON.stringify(amountCompletedNotCompleted));
    });

    $.getJSON("/amountPriorityNoPriority", function (data) {
        amountPriorityNoPriority = data;
        $("#priority").text(amountPriorityNoPriority[0]["priority"]);
        $("#noPriority").text(amountPriorityNoPriority[0]["notPriority"]);
        console.log("Amount priority & no priority: " + JSON.stringify(amountPriorityNoPriority));
    });

    $.getJSON("/avgCompletionTimePerList", function (data) {
        var divElement, histogram, maxValue, widthHistogram, yaxis;
        histogram = document.getElementById("histogram");
        widthHistogram = data.length*50;
        histogram.style.width = widthHistogram +"px";
        histogram.innerHTML = "";
        console.log("Element: "+ histogram);
        maxValue = 0;
        for(var key in data){
            if(maxValue < data[key].avgTime){
                maxValue = data[key].avgTime;
            }
        }
        yaxis = document.getElementById("yaxis");
        yaxis.innerHTML = maxValue;
        for(var key in data){
            divElement = document.createElement("div");
            divElement.style.height = ""+Math.floor((data[key].avgTime/maxValue)*100)+"px";
            divElement.style.width = "48px";
            divElement.className = "bar";
            console.dir(divElement);
            histogram.appendChild(divElement);
        }
        console.log("Average completiontime per list: " + JSON.stringify(data));
    });
}

getData();
//Get the data every second
setInterval(function () {
    getData();
}, 1000);