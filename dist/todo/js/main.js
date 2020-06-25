//const input = document.getElementById("input");
//const button = document.getElementById("button");
const todo = document.getElementById("todo");
let todoList = [];
let todoListSorted = [];
let sorted = 0;
var filter_complete = false;
var filter_active = false;
var filter_search = false;
var search_text = "";
var syncServer = 0;
var $ = function (sel) {
    return document.querySelector(sel);
};
var $All = function (sel) {
    return document.querySelectorAll(sel);
};

document.getElementById("addBtn").onclick = function () {
    //addTodo();
    location.href = "addTodo.html";
};

document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode === 13) {
        document.getElementById("addBtn").click();
    }
};

// 将本地localStorage数据同步到云端
function SyncServer() {
    console.log("自动保存");
    showMsg("自动保存中...");
    uploadTodo();
    //setTimeout(flushFromServer, 2000);
}

// 本地localStorage改动后触发此函数，当用户60秒之内无其他改动后，会同步到云端
function prepareSync() {
    syncServer += 1;
    console.log(syncServer);
    setTimeout(function () {
        syncServer -= 1;
        if (syncServer === 0) {
            SyncServer();
        }
    }, 3000)
}

function flushFromServer() {
    console.log(localStorage);
    var username = localStorage["username"];
    if (localStorage["sorted"]) {
        sorted = parseInt(localStorage["sorted"]);
    } else {
        sorted = 0;
        localStorage.setItem("sorted", "0");
    }
    console.log(username);
    if (username) {
        loadTodo(username);
    }
    showSaying();
}

// 从服务器加载todo
function loadTodo(username) {
    console.log(localStorage);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //console.log(this.responseText);
            let resp = JSON.parse(this.responseText) || [];
            let todo = resp["todo"];
            localStorage.setItem("todo", todo);
            //console.log(todo);
            flush();
        }
    };
    xhttp.open("GET", "http://167.179.66.112:1323/api/username/" + username.toString(), true);
    xhttp.send();
}


function compareTime(param, method) {
    return function (todo1, todo2) {
        var time1 = todo1[param];
        var time2 = todo2[param];
        if (method === 1) {
            return time1 - time2;     // 升序
        } else {
            return time2 - time1;     // 升序
        }
    }
}

function getTodoListFromLocalStorage() {
    let todos = localStorage.getItem("todo");
    if (todos) {
        todoList = JSON.parse(todos);
    } else {
        todoList = [];
    }
}


// 从localStorage中刷新表单
function flush() {
    flushTheme();
    flushLang();
    todo.innerHTML = null;
    getTodoListFromLocalStorage();
    console.log(todoList);
    //var todoListStore = todoList;
    if (sorted === 0) {
        todoList = todoList.sort(compareTime("createTime", -1));
    } else if (sorted === 1) {
        todoList = todoList.sort(compareTime("date", 1));
        //console.log(todoShow);
    } else if (sorted === 2) {
        todoList = todoList.sort(compareTime("date", -1));
        //console.log(todoShow);
    } else {
        todoList = todoList.sort(compareTime("createTime", 1));
    }


    console.log(todoList);
    for (let i = 0; i < todoList.length; i++) {

        const item = document.createElement("li");
        item.id = "item";

        // create checkbox to update completed state
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.classList.add("toggle");

        if (todoList[i].completed) {
            item.classList.add("completed");
            item.classList.remove("uncompleted");
            checkbox.checked = todoList[i].completed;
        } else {
            item.classList.add("uncompleted");
            item.classList.remove("completed");
            checkbox.checked = todoList[i].completed;
        }
        showDeleteCompleteBtn();

        checkbox.addEventListener("click", function (e) {
            todoList[i].completed = e.target.checked;
            localStorage.setItem("todo", JSON.stringify(todoList));
            prepareSync();
            if (todoList[i].completed) {
                item.classList.add("completed");
                item.classList.remove("uncompleted");
                checkbox.checked = todoList[i].completed;
            } else {
                item.classList.add("uncompleted");
                item.classList.remove("completed");
                checkbox.checked = todoList[i].completed;
            }
            showDeleteCompleteBtn();
        });

        const text = document.createElement("p");
        text.innerText = todoList[i].text;

        const delButton = document.createElement("button");
        //button.innerText = "X";
        //button.innerHTML = "<svg t=\"1592107743494\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2678\" width=\"20\" height=\"20\"><path d=\"M873.594739 873.716723a511.792629 511.792629 0 1 1 0-723.848188 511.792629 511.792629 0 0 1 0 723.848188z m-129.0826-543.313083a36.594954 36.594954 0 0 0-51.769662-51.720868l-181.120625 181.267005-181.145022-181.267005a36.594954 36.594954 0 0 0-51.745264 51.720868l181.120625 181.267005-181.120625 181.023039a36.594954 36.594954 0 0 0 51.745264 51.720868l181.145022-181.023038 181.120625 181.023038a36.594954 36.594954 0 0 0 51.769662-51.720868l-181.145022-181.023039z\" p-id=\"2679\" fill=\"#6b0fe4\"></path></svg>";
        delButton.innerHTML = "<svg t=\"1592108072628\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"3104\" width=\"20\" height=\"20\"><path d=\"M942.656 96.448 561.984 96.64 561.728 46.72c0-25.664-20.224-46.464-45.184-46.464-0.768 0-1.408 0.384-2.176 0.448-0.768 0-1.408-0.448-2.176-0.448-24.96 0-45.248 20.8-45.248 46.464L467.2 96.64 81.344 96.832c-25.024 0-45.248 20.864-45.248 46.464 0 25.664 20.224 46.4 45.248 46.4l48.768 0 0.32 692.16L130.56 881.856l0 49.152c0 51.008 40.448 92.288 90.432 92.288L266.24 1023.296l0 0.384 497.536-0.32 0-0.064 45.248 0c49.664 0 89.92-40.896 90.432-91.52L899.2 283.264c0-25.472-20.224-46.208-45.248-46.208-25.088 0-45.248 20.672-45.248 46.208l0.32 583.36c-4.8 53.696-26.56 64.448-89.28 64.448l1.152 0-421.696 0.256 11.008-0.256c-62.528 0-84.352-10.752-89.28-63.936L220.608 189.632l722.048-0.32c25.024 0 45.248-20.8 45.248-46.464S967.616 96.448 942.656 96.448z\" p-id=\"3105\" fill=\"#ffffff\"></path><path d=\"M401.28 232.512c-24.96 0-45.248 20.8-45.248 46.4l0.448 559.104c0 25.6 20.224 46.4 45.248 46.4 24.96 0 45.248-20.736 45.248-46.4L446.528 278.912C446.528 253.312 426.24 232.512 401.28 232.512z\" p-id=\"3106\" fill=\"#ffffff\"></path><path d=\"M627.456 232.512c-24.96 0-45.248 20.8-45.248 46.4l0.448 559.104c0 25.6 20.224 46.4 45.248 46.4s45.184-20.736 45.184-46.4l-0.384-559.104C672.704 253.312 652.416 232.512 627.456 232.512z\" p-id=\"3107\" fill=\"#ffffff\"></path></svg>";
        delButton.id = "delBtn";
        delButton.addEventListener("click", function () {
            todoList.splice(i, 1);
            localStorage.setItem("todo", JSON.stringify(todoList));
            flush();
            prepareSync();
        });


        const editButton = document.createElement("button");
        editButton.innerHTML = "<svg t=\"1592109855118\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1143\" width=\"20\" height=\"20\"><path d=\"M798.165333 97.834667a42.624 42.624 0 0 0-60.330666 0l-341.333334 341.333333a42.794667 42.794667 0 0 0-11.221333 19.797333l-42.666667 170.666667a42.666667 42.666667 0 0 0 51.712 51.754667l170.666667-42.666667c7.509333-1.877333 14.378667-5.76 19.84-11.221333l341.333333-341.333334a42.624 42.624 0 0 0 0-60.330666l-128-128z m-265.344 460.970666l-90.197333 22.528 22.570667-90.197333L768 188.330667 835.669333 256l-302.848 302.805333z\" fill=\"#ffffff\" p-id=\"1144\"></path><path d=\"M213.333333 853.333333h597.333334a42.666667 42.666667 0 0 0 42.666666-42.666666v-256h-85.333333v213.333333H256V256h213.333333V170.666667H213.333333a42.666667 42.666667 0 0 0-42.666666 42.666666v597.333334a42.666667 42.666667 0 0 0 42.666666 42.666666z\" fill=\"#ffffff\" p-id=\"1145\"></path></svg>";
        editButton.id = "editBtn";
        editButton.addEventListener("click", function () {
            //console.log(i);
            const editInput = document.createElement("input");
            editInput.innerText = todoList[i].text;
            let editText = todo.childNodes[i];
            let thisText = todoList[i].text;
            editText.innerHTML = "<input type='text' value='" + thisText + "'> <button id='modifyOKBtn' onclick='modifyText(" + i + ")'><svg t=\"1592126891640\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"4231\" width=\"20\" height=\"20\"><path d=\"M860.048 375.018 522.717 712.35l-63.366 63.365c-8.387 8.387-20.035 13.045-31.684 13.045-11.647 0-23.296-4.658-31.683-13.045l-63.366-63.365L163.953 543.684c-8.387-8.387-13.047-20.035-13.047-31.683s4.66-23.296 13.047-31.683l63.365-63.366c8.387-8.387 20.035-13.046 31.684-13.046s23.296 4.659 31.683 13.046l136.982 137.447 305.648-306.113c8.387-8.387 20.035-13.046 31.683-13.046 11.648 0 23.297 4.659 31.684 13.046l63.366 63.366c8.387 8.387 13.046 20.035 13.046 31.683C873.094 354.983 868.435 366.631 860.048 375.018z\" p-id=\"4232\" fill=\"#ffffff\"></path></svg></button>"
            //todoList.splice(i, 1);
            //localStorage.setItem("todo", JSON.stringify(todoList));
            //flush();
        });

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "buttonGroup";
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(delButton);

        if (filter_complete && !todoList[i].completed) {
            todo.appendChild(item);
            continue;
        }
        if (filter_active && todoList[i].completed) {
            todo.appendChild(item);
            continue;
        }

        if (filter_search) {
            var searchText = $('#searchBar').value;
            console.log(text.innerText);
            // 没有匹配到
            if (text.innerText.indexOf(searchText) === -1) {
                todo.appendChild(item);
                continue;
            }
        }
        item.appendChild(checkbox);
        item.appendChild(text);
        //item.appendChild(delButton);
        //item.appendChild(editButton);
        item.appendChild(buttonGroup);

        todo.appendChild(item);
        //input.value = null;
    }
    //setFooterText();
}


function modifyText(i) {
    console.log(i);
    var newText = todo.childNodes[i].childNodes[0].value;
    console.log(newText);
    todoList[i].text = newText;
    localStorage.setItem("todo", JSON.stringify(todoList));
    //showMsg("修改成功!");
    prepareSync();
    flush();
}

function toggleAll() {
    let allFinish = true;
    for (let i = 0; i < todoList.length; i++) {
        if (!todoList[i].completed) {
            console.log(todo.childNodes[i]);
            todo.childNodes[i].classList.add("completed");
            todo.childNodes[i].classList.remove("uncompleted");
            todoList[i].completed = true;
            allFinish = false;
        }
    }
    if (allFinish) {
        for (let i = 0; i < todoList.length; i++) {
            todo.childNodes[i].classList.add("uncompleted");
            todo.childNodes[i].classList.remove("completed");
            todoList[i].completed = false;
        }
    }
    localStorage.setItem("todo", JSON.stringify(todoList));
    prepareSync();
    flush();
}

/*
function setFooterText() {
    var text = "If you don’t know where you are going, you’ll end up someplace else.";
    var people = "- Yogi Berra";
    document.getElementById("footer").innerText = text;
}
*/

function filterAll() {
    filter_complete = false;
    filter_active = false;
    $('#filterActiveBtn').className = "inactiveBtn";
    $('#filterCompleteBtn').className = "inactiveBtn";
    $('#filterAllBtn').className = "activeBtn";
    flush();
}

function filterComplete() {
    filter_complete = true;
    filter_active = false;
    $('#filterActiveBtn').className = "inactiveBtn";
    $('#filterCompleteBtn').className = "activeBtn";
    $('#filterAllBtn').className = "inactiveBtn";
    flush();
}

function filterActive() {
    filter_complete = false;
    filter_active = true;
    $('#filterActiveBtn').className = "activeBtn";
    $('#filterCompleteBtn').className = "inactiveBtn";
    $('#filterAllBtn').className = "inactiveBtn";
    flush();
}

function toggleSearch() {
    filter_search = !filter_search;
    var searchBar = $('#searchBar');
    if (searchBar.style.visibility === "visible") {
        searchBar.style.visibility = "hidden";
    } else {
        searchBar.style.visibility = "visible";
    }

}

function OnInput(event) {
    //console.log(event.target.value);
    flush();
}

// 决定是否显示deleteComplete按钮（取决于是否有已完成的Todo））
function showDeleteCompleteBtn() {
    let hasCompleteTodo = false;
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].completed) {
            hasCompleteTodo = true;
        }
    }
    if (hasCompleteTodo) {
        document.getElementById('delCompleteBtn').style.visibility = "visible";
    } else {
        document.getElementById('delCompleteBtn').style.visibility = "hidden";
    }
}

function deleteComplete() {
    getTodoListFromLocalStorage();
    for (let i = todoList.length - 1; i >= 0; i--) {
        if (todoList[i].completed) {
            todoList.splice(i, 1);
            localStorage.setItem("todo", JSON.stringify(todoList));
            flush();
            prepareSync();
        }
    }
}

function sortTodo() {
    sorted = parseInt(localStorage.getItem("sorted"));
    sorted = sorted + 1;
    if (sorted > 3) {
        sorted = 0;
    }
    console.log(sorted);
    localStorage.setItem("sorted", sorted.toString());
    flush();
}

function changeLang() {
    if (localStorage.getItem("lang") !== "en") {
        localStorage.setItem("lang", "en");
    } else {
        localStorage.setItem("lang", "zh");
    }
    console.log(localStorage);
    //prepareSync();
    flush();
}



function showSaying() {
    //document.getElementById("modal").style.visibility = "visible";
    document.getElementById('modal').style.display = 'block';
    setTimeout(function () {
        document.getElementById('modal').style.opacity = 1;
    }, 20);

    var i = randomBetween(0, sayings.length);
    console.log("i=" + i);
    var saying = document.getElementById("saying");
    if (localStorage.getItem("lang") === "zh") {
        saying.innerText = sayings[i]["saying-zh"];
        document.getElementById("author").innerText = sayings[i]["author-zh"];
    } else {
        saying.innerText = sayings[i]["saying"];
        document.getElementById("author").innerText = sayings[i]["author"];
    }

    setTimeout(function () {
        document.getElementById('modal').style.opacity = 0;  //  修改div的透明度

        //  延迟400毫秒
        setTimeout(function () {
            document.getElementById('modal').style.display = 'none';  //  修改div的display
        }, 400);
    }, 2000)
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function showSpine() {
    document.getElementById("spine").style.visibility = "visible";
    document.getElementById("leim-icon").style.visibility = "hidden";
}

function closeSpine() {
    document.getElementById("spine").style.visibility = "hidden";
    document.getElementById("leim-icon").style.visibility = "visible";
}

window.onload = function () {
    //flushFromServer();
    flush();
    showSaying();
};
