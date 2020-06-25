window.onload = function () {
    loadUserInfo();
    flushTheme();
};


function loadUserInfo() {
    var username = localStorage["username"];
    console.log(username);
    if (username) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let resp = JSON.parse(this.responseText) || [];
                document.getElementById("avatar").src = resp["avatar"];
                document.getElementById("title").innerText = resp["name"];
            }
        };
        xhttp.open("GET", "https://yicheng.me/todoapi/username/" + username.toString(), true);
        xhttp.send();
    } else {
        showMsg("请先登录");
        setTimeout(function () {
            location.href = "login.html";
        })
    }
}
