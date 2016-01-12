function changeTextSize(selector) {
    $("#todoList").find("div").css("font-size", selector.value + "px");
    $("#todoList").find("div").css("height", selector.value * 2);
    console.log(selector.value);
    Cookies.remove("textSize");
    Cookies.set("textSize", selector.value, { expires: 7 });
}