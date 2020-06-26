/* by enginewang
   github: https://github.com/enginewang
   website: https://yicheng.me
   last update: 2020.06.25
*/

const todo = document.getElementById("todo");
let todoList = [];
let sorted = 0;
var filter_complete = false;
var filter_active = false;
var filter_search = false;
var syncServer = 0;
var $ = function (sel) {
    return document.querySelector(sel);
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

// 本地localStorage改动后触发此函数，当用户3秒之内无其他改动后，会同步到云端
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

// 从服务器刷新数据到本地，只有登录之后来到index才会调用，其他时候尽量会调用flush以减少响应时间
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
    xhttp.open("GET", "https://yicheng.me/todoapi/username/" + username.toString(), true);
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


// 从localStorage中刷新表单，最核心的逻辑
function flush() {
    // 刷新主题
    flushTheme();
    // 刷新语言
    flushLang();
    // 清空todo
    todo.innerHTML = null;
    // 加载localStorage的信息到todoList数组
    getTodoListFromLocalStorage();
    console.log(todoList);
    // 通过是否存在已完成项目来判断是否显示"删除已完成"按钮
    judgeCompleteAndActive();
    // sort逻辑，利用js的数组自带的sort加前面自定义的compareTime函数来实现排序
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
    // 最核心的for循环，遍历要渲染的todoList
    for (let i = 0; i < todoList.length; i++) {
        // 创建<li>标签，表示每一条todo
        const item = document.createElement("li");
        item.id = "item";
        // 创建checkbox来实现完成/未完成的toggle
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.classList.add("toggle");

        // 通过判断完成与未完成，来增加样式，显示complete与incomplete的区别
        if (todoList[i].completed) {
            item.classList.add("completed");
            item.classList.remove("uncompleted");
            checkbox.checked = todoList[i].completed;
        } else {
            item.classList.add("uncompleted");
            item.classList.remove("completed");
            checkbox.checked = todoList[i].completed;
        }
        // checkbox的toggle逻辑
        checkbox.addEventListener("click", function (e) {
            todoList[i].completed = e.target.checked;
            localStorage.setItem("todo", JSON.stringify(todoList));
            // 只要发生改变，触发prepareSync进行延时更新
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
            judgeCompleteAndActive();
        });
        // 重要/紧急的icon显示逻辑
        const icons = document.createElement("p");
        icons.className = "icons";
        if(todoList[i].important === 0){
            icons.innerHTML += "<svg t=\"1593148565403\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2432\" width=\"16\" height=\"16\"><path d=\"M885.942179 427.687756l-267.445168-22.933315-104.470353-246.470461L409.553235 404.75444l-267.336698 22.933315 202.846918 175.770236-60.789505 261.34524 229.753731-138.569986 229.859132 138.569986-60.785411-261.34524L885.942179 427.687756zM514.026658 656.403854l-139.875724 84.425831 37.038568-159.160953-123.591853-106.975407 162.91751-14.053064 63.511499-150.116973 63.620993 150.116973 162.860205 14.053064-123.534548 106.975407 37.038568 159.160953L514.026658 656.403854z\" p-id=\"2433\" fill=\"#3366ff\"></path></svg>"
        }
        if(todoList[i].urgent === 0){
            icons.innerHTML += "<svg t=\"1593148999170\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1702\" width=\"16\" height=\"16\"><path d=\"M245.2 546.86c13.39 8.21 29.11 12.55 45.49 12.55h104.42l-47.88 312.77c-5.17 33.76 12.77 65.02 45.7 79.65 11.5 5.11 24.13 7.73 36.67 7.73 5.13 0 10.26-0.44 15.28-1.33 19.92-3.53 37.12-13.59 49.76-29.09L773.7 586.82c18.03-22.12 21.75-51.62 9.7-76.99-6.44-13.55-16.81-24.99-30-33.08-13.39-8.21-29.11-12.55-45.49-12.55H603.49l47.88-312.77c5.17-33.76-12.77-65.02-45.7-79.65-16.2-7.2-34.65-9.47-51.96-6.4-19.92 3.53-37.13 13.59-49.77 29.09L224.9 436.79c-18.03 22.12-21.75 51.62-9.71 76.99 6.44 13.55 16.82 24.99 30.01 33.08z m32.61-66.94L556.86 137.6c3.28-4.03 7.83-5.31 12.05-5.31 3.58 0 6.92 0.92 9.06 1.87 1.62 0.72 6.54 2.91 5.93 6.93l-52.4 342.32c-0.05 0.33-0.16 0.67-0.32 1.04a34.125 34.125 0 0 0 2.57 32.46 34.145 34.145 0 0 0 28.62 15.54h145.56c7.37 0 12.26 3.34 13.83 6.66 0.62 1.3 0.88 2.32-0.95 4.57L441.74 886c-6.07 7.44-16.46 5.5-21.11 3.44-1.62-0.72-6.54-2.91-5.93-6.93l52.4-342.32c0.05-0.33 0.16-0.67 0.32-1.05a34.125 34.125 0 0 0-31.19-47.99H290.69c-7.37 0-12.26-3.34-13.83-6.66-0.62-1.3-0.89-2.32 0.95-4.57z\" fill=\"#3366ff\" p-id=\"1703\"></path></svg>"
        }

        const text = document.createElement("p");
        text.className = "todo-text";
        console.log(todoList);

        text.innerHTML += todoList[i].text;
        console.log(text.innerHTML);

        const delButton = document.createElement("button");
        // 删除按钮
        delButton.innerHTML = "<svg t=\"1592108072628\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"3104\" width=\"20\" height=\"20\"><path d=\"M942.656 96.448 561.984 96.64 561.728 46.72c0-25.664-20.224-46.464-45.184-46.464-0.768 0-1.408 0.384-2.176 0.448-0.768 0-1.408-0.448-2.176-0.448-24.96 0-45.248 20.8-45.248 46.464L467.2 96.64 81.344 96.832c-25.024 0-45.248 20.864-45.248 46.464 0 25.664 20.224 46.4 45.248 46.4l48.768 0 0.32 692.16L130.56 881.856l0 49.152c0 51.008 40.448 92.288 90.432 92.288L266.24 1023.296l0 0.384 497.536-0.32 0-0.064 45.248 0c49.664 0 89.92-40.896 90.432-91.52L899.2 283.264c0-25.472-20.224-46.208-45.248-46.208-25.088 0-45.248 20.672-45.248 46.208l0.32 583.36c-4.8 53.696-26.56 64.448-89.28 64.448l1.152 0-421.696 0.256 11.008-0.256c-62.528 0-84.352-10.752-89.28-63.936L220.608 189.632l722.048-0.32c25.024 0 45.248-20.8 45.248-46.464S967.616 96.448 942.656 96.448z\" p-id=\"3105\" fill=\"#ffffff\"></path><path d=\"M401.28 232.512c-24.96 0-45.248 20.8-45.248 46.4l0.448 559.104c0 25.6 20.224 46.4 45.248 46.4 24.96 0 45.248-20.736 45.248-46.4L446.528 278.912C446.528 253.312 426.24 232.512 401.28 232.512z\" p-id=\"3106\" fill=\"#ffffff\"></path><path d=\"M627.456 232.512c-24.96 0-45.248 20.8-45.248 46.4l0.448 559.104c0 25.6 20.224 46.4 45.248 46.4s45.184-20.736 45.184-46.4l-0.384-559.104C672.704 253.312 652.416 232.512 627.456 232.512z\" p-id=\"3107\" fill=\"#ffffff\"></path></svg>";
        delButton.id = "delBtn";
        delButton.addEventListener("click", function () {
            todoList.splice(i, 1);
            localStorage.setItem("todo", JSON.stringify(todoList));
            flush();
            prepareSync();
        });

        //编辑按钮
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

        });

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "buttonGroup";
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(delButton);

        // filter逻辑，如果不符合filter，那么这一个item不会被作为子节点渲染进html
        if (filter_complete && !todoList[i].completed) {
            todo.appendChild(item);
            continue;
        }
        if (filter_active && todoList[i].completed) {
            todo.appendChild(item);
            continue;
        }
        // 搜索的filter，和前面一样
        if (filter_search) {
            var searchText = $('#searchBar').value;
            console.log(text.innerText);
            // 没有匹配到
            if (text.innerText.indexOf(searchText) === -1) {
                todo.appendChild(item);
                continue;
            }
        }
        // DOM链接子节点
        item.appendChild(checkbox);
        item.appendChild(icons);
        item.appendChild(text);
        item.appendChild(buttonGroup);
        todo.appendChild(item);
    }
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
        showBubble("一键完成也太强了");
    }
    if (allFinish) {
        for (let i = 0; i < todoList.length; i++) {
            todo.childNodes[i].classList.add("uncompleted");
            todo.childNodes[i].classList.remove("completed");
            todoList[i].completed = false;
        }
        showBubble("全都恢复为未完成了");
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
function judgeCompleteAndActive() {
    var activeCount = 0;
    let hasCompleteTodo = false;
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].completed) {
            hasCompleteTodo = true;
        } else {
            activeCount += 1;
        }
    }
    if (hasCompleteTodo) {
        document.getElementById('delCompleteBtn').style.visibility = "visible";
        if(isZH()){
            document.getElementById("delCompleteBtn").innerText = "删除已完成";
        }else {
            document.getElementById("delCompleteBtn").innerText = "Delete Complete";
        }
    } else {
        document.getElementById('delCompleteBtn').style.visibility = "hidden";
    }
    if(isZH()){
        document.getElementById("activeCount").innerText = "未完成：" + activeCount.toString();
    }else {
        document.getElementById("activeCount").innerText = "Active: " + activeCount.toString();
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
    showBubble("做完的都删除了")
}

function sortTodo() {
    sorted = parseInt(localStorage.getItem("sorted"));
    sorted = sorted + 1;
    if (sorted > 3) {
        sorted = 0;
    }
    console.log(sorted);
    localStorage.setItem("sorted", sorted.toString());
    if (sorted === 0) {
        showBubble("按添加时间逆序");
    } else if (sorted === 1) {
        showBubble("按截止时间顺序");
        //console.log(todoShow);
    } else if (sorted === 2) {
        showBubble("按截止时间逆序");
        //console.log(todoShow);
    } else {
        showBubble("按添加时间顺序");
    }
    flush();
}

function changeLang() {
    if (localStorage.getItem("lang") !== "en") {
        localStorage.setItem("lang", "en");
        showBubble("切换为英文<span style='font-size: 2px'>(不过我不会英文</span>");
    } else {
        localStorage.setItem("lang", "zh");
        showBubble("切换为中文");
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

function showDocModal() {
    //document.getElementById("modal").style.visibility = "visible";
    document.getElementById('modal-doc').style.display = 'block';
    document.getElementById("doc-text").innerText = "需要看看使用教程吗？";
    setTimeout(function () {
        document.getElementById('modal-doc').style.opacity = 1;
    }, 20);
}

function closeDocModal() {
    document.getElementById('modal-doc').style.opacity = 0;  //  修改div的透明度
    //  延迟400毫秒
    setTimeout(function () {
        document.getElementById('modal-doc').style.display = 'none';  //  修改div的display
    }, 400);
}

function showDoc(){
    document.getElementById("doc").style.visibility = "visible";
}

function closeDoc(){
    document.getElementById("doc").style.visibility = "hidden";
    closeDocModal();
}


function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function showSpine() {
    document.getElementById("spine").style.visibility = "visible";
    document.getElementById("leim-icon").style.visibility = "hidden";
    showBubble("有什么事吗");
}

function closeSpine() {
    document.getElementById("spine").style.visibility = "hidden";
    document.getElementById("leim-icon").style.visibility = "visible";
    showBubble("再见👋");
}

window.onload = function () {
    if (localStorage.getItem("username")) {
        // 如果是从登录进入会从服务器刷新数据到本地，并且显示教程提示
        if (localStorage.getItem("first-login") === "true"){
            flushFromServer();
            showDocModal();
            showBubble("欢迎~");
            localStorage.setItem("first-login", "false");
        } else{
            // 一般情况，会普通刷新localStorage的数据到本地，然后随机显示一条有关时间和计划的名人名言
            flush();
            showSaying();
        }
    } else {
        showBubble("先去登录吧~");
        // localStorage没有用户信息的话直接跳转到登录页面
        location.href = "login.html";
    }
};
