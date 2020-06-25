var sayings = [
    {
        "saying": "Do you love life? Then do not squander time; for that's the stuff life is made of.",
        "author": "Benjamin Franklin",
        "saying-zh": "你热爱生命吗？那么，别浪费时间，因为生命是由时间组成的。",
        "author-zh": "富兰克林. B.",
    },
    {
        "saying": "Each moment in history is a fleeting time, precious and unique.",
        "author": "Richard Nixon",
        "saying-zh": "历史巨轮飞转，分分秒秒的时间都十分宝贵，也独具意义。",
        "author-zh": "尼克松. R."
    },
    {
        "saying": "The time of life is short; to spend that shortness basely, it would be too long.",
        "author": "William Shakespeare",
        "saying-zh": "人生苦短，若虚度年华，则短暂的人生就太长了。",
        "author-zh": "莎士比亚. W."
    },
    {
        "saying": "I am a slow walker , but I never walk backwards.",
        "author": "Abraham Lincoln",
        "saying-zh": "我走得很慢，但是我从来不会后退。。",
        "author-zh": "林肯. A."
    },
    {
        "saying": "Ordinary people merely think how they shall spend their time ; a man of talent tries to use it.",
        "author": "Arthur Schopenhauer",
        "saying-zh": "普通人只想到如何度过时间，有才能的人设法利用时间。",
        "author-zh": "叔本华. A."
    },
    {
        "saying": "We always have time enough , if we will but use it aright.",
        "author": "Johan Wolfgang von Goethe",
        "saying-zh": "只要我们能善用时间，就永远不愁时间不够用。",
        "author-zh": "歌德. J.W."
    },
];


function flushLang() {
    var lang_dict = {
        "title": {"en": "Todo APP", "zh": "极简清单"},
        "notice": {"en": " - Add something todo NOW - ", "zh": "- 添加一些计划吧！ -"},
        "add-new-btn": {"en": "Add New Todo", "zh": "添加新计划"},
        "all-tab": {"en": "All", "zh": "所有"},
        "complete-tab": {"en": "Complete", "zh": "已完成"},
        "active-tab": {"en": "Active", "zh": "待完成"},
        "add-text-placeholder": {"en": "Add Todo Text Here", "zh": "请在这里写下计划"},
        "add-ddl-placeholder": {"en": "Choose DeadLine", "zh": "选择计划的截止日期"},
        "add-btn": {"en": "Add Todo", "zh": "添 加"},
        "cancel-btn": {"en": "Cancel", "zh": "取 消"},
    };
    if (document.getElementById("notice")) {
        document.getElementById("notice").innerText = lang_dict["notice"][localStorage.getItem("lang")];
    }
    if (document.getElementById("title")) {
        document.getElementById("title").innerText = lang_dict["title"][localStorage.getItem("lang")];
    }
    if (document.getElementById("addBtn")) {
        document.getElementById("addBtn").innerText = lang_dict["add-new-btn"][localStorage.getItem("lang")];
    }
    if (document.getElementById("filterAllBtn")) {
        document.getElementById("filterAllBtn").innerText = lang_dict["all-tab"][localStorage.getItem("lang")];
    }
    if (document.getElementById("filterCompleteBtn")) {
        document.getElementById("filterCompleteBtn").innerText = lang_dict["complete-tab"][localStorage.getItem("lang")];
    }
    if (document.getElementById("filterActiveBtn")) {
        document.getElementById("filterActiveBtn").innerText = lang_dict["active-tab"][localStorage.getItem("lang")];
    }
    if (document.getElementById("inputTaskName")) {
        document.getElementById("inputTaskName").placeholder = lang_dict["add-text-placeholder"][localStorage.getItem("lang")];
    }
    if (document.getElementById("datepicker")) {
        document.getElementById("datepicker").placeholder = lang_dict["add-ddl-placeholder"][localStorage.getItem("lang")];
    }

    if (document.getElementById("important-select")) {
        if (isZH()) {
            document.getElementById("important-select").options[0].innerText = "重要";
            document.getElementById("important-select").options[1].innerText = "不重要";
            document.getElementById("urgent-select").options[0].innerText = "紧急";
            document.getElementById("urgent-select").options[1].innerText = "不紧急";
        } else {
            document.getElementById("important-select").options[0].innerText = "Important";
            document.getElementById("important-select").options[1].innerText = "Not Important";
            document.getElementById("urgent-select").options[0].innerText = "Urgent";
            document.getElementById("urgent-select").options[1].innerText = "Not Urgent";
        }
    }

    if (document.getElementById("add-btn")) {
        document.getElementById("add-btn").innerText = lang_dict["add-btn"][localStorage.getItem("lang")];
    }
    if (document.getElementById("back-btn")) {
        document.getElementById("back-btn").innerText = lang_dict["cancel-btn"][localStorage.getItem("lang")];
    }
}


function uploadTodo() {
    var todos;
    //alert(localStorage.getItem("todo"));
    // [{"text":"1","date":1591891200000,"createTime":1593075977363,"completed":false,"important":0,"urgent":0}]
    if (localStorage.getItem("todo")) {
        todos = JSON.parse(localStorage.getItem("todo"))
    } else {
        todos = [];
    }
    var newTodo = JSON.stringify({todo: JSON.stringify(todos)});
    var username = localStorage.getItem("username");
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            //alert(xmlHttp.responseText);
            console.log(xmlHttp.responseText);
        }
    };
    xmlHttp.open("post", "http://167.179.66.112:1323/api/updateTodo/" + username.toString());
    xmlHttp.setRequestHeader("content-type", "application/json");
    xmlHttp.send(newTodo);
}


function showMsg(text) {
    document.getElementById("msg-bar").innerText = text;
    document.getElementById("msg-bar").classList.add('showUp');
    setTimeout(function () {
        document.getElementById("msg-bar").classList.remove('showUp');
        document.getElementById("msg-bar").classList.add('disappear');
        setTimeout(function () {
            document.getElementById("msg-bar").classList.remove('disappear');
        }, 1000);
    }, 2000)
}


function logout() {
    goToLogin();
}

function goToUserDetail() {
    location.href = "user.html";
}

function goToRegister() {
    location.href = "register.html";
}

function goToLogin() {
    location.href = "login.html";
}

function goToAddTodo() {
    location.href = "addTodo.html";
}

function goToIndex() {
    location.href = "index.html";
}

/*
// 退出时调用，保存修改到云端
window.onbeforeunload = function(){
    uploadTodo();
    prompt("退出后会自动保存，确认退出？");
};
*/

function isZH() {
    if (localStorage.getItem("lang") === "zh") {
        return true;
    } else {
        return false;
    }
}

function flushTheme() {
    var theme = localStorage.getItem("theme");
    if (theme === "dark") {
        setDarkTheme();
        console.log("set dark theme");
    } else {
        localStorage.setItem("theme", "blue");
        console.log("set blue theme");
        setBlueTheme();
    }
}

function setBlueTheme() {
    document.body.style.setProperty('--theme-color', '#3366ff');
    document.body.style.setProperty('background-color', '#e0f0fd');
    if (document.getElementsByClassName("todo")[0]) {
        document.getElementsByClassName("todo")[0].classList.remove("bg-gradient-dark");
        document.getElementsByClassName("todo")[0].classList.add("bg-gradient-primary");
    }
    if (document.getElementsByClassName("add-todo")[0]) {
        document.getElementsByClassName("add-todo")[0].classList.remove("bg-gradient-dark");
        document.getElementsByClassName("add-todo")[0].classList.add("bg-gradient-primary");
    }
}

function setDarkTheme() {
    document.body.style.setProperty('--theme-color', '#232323');
    document.body.style.setProperty('background-color', '#fff');
    if (document.getElementsByClassName("todo")[0]) {
        document.getElementsByClassName("todo")[0].classList.remove("bg-gradient-primary");
        document.getElementsByClassName("todo")[0].classList.add("bg-gradient-dark");
    }
    if (document.getElementsByClassName("add-todo")[0]) {
        document.getElementsByClassName("add-todo")[0].classList.remove("bg-gradient-primary");
        document.getElementsByClassName("add-todo")[0].classList.add("bg-gradient-dark");
    }
}

function changeTheme() {
    console.log("change theme");
    var theme = localStorage.getItem("theme");
    if (theme === "dark") {
        setBlueTheme();
        localStorage.setItem("theme", "blue");
    } else {
        setDarkTheme();
        localStorage.setItem("theme", "dark");
    }
}


