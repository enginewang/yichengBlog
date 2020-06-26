// 注册表单提交
function submitRegister()
{
    let username = document.getElementsByName("username")[0].value;
    let password = document.getElementsByName("password")[0].value;
    if (username === "") {
        showMsg("用户名不能为空！");
    } else if (password === "") {
        showMsg("密码不能为空！");
    } else {
        var formData = JSON.stringify({"name": username.toString(), "password": password.toString()});
        let xmlHttp = new XMLHttpRequest();
        console.log(formData);
        xmlHttp.onreadystatechange = function()
        {
            if(xmlHttp.readyState === 4 && xmlHttp.status === 200)
            {
                console.log(xmlHttp.responseText);
                showMsg("注册成功！即将跳转到登录页面");
                setTimeout(function () {
                    window.location.replace("login.html");
                }, 2000);
            } else if(xmlHttp.status === 204) {
                showMsg("这个用户名已经存在了，请换一个！");
            }
        };
        xmlHttp.open("post", "https://yicheng.me/todoapi/register");
        xmlHttp.setRequestHeader("content-type","application/json");
        xmlHttp.send(formData);
    }
}


// 登录表单提交
function submitLogin()
{
    let username = document.getElementsByName("username")[0].value;
    let password = document.getElementsByName("password")[0].value;
    var formData = JSON.stringify({"name": username.toString(), "password": password.toString()});
    let xmlHttp = new XMLHttpRequest();
    console.log(formData);
    xmlHttp.onreadystatechange = function()
    {
        if(xmlHttp.readyState === 4 && xmlHttp.status === 200)
        {
            console.log(xmlHttp.responseText);
            //localStorage.clear();
            localStorage.setItem("username", username);
            localStorage.setItem("lang", "zh");
            localStorage.setItem("sorted", "0");
            showMsg("登录成功!即将跳转到主页");
            setTimeout(function () {
                localStorage.setItem("first-login", "true");
                window.location.replace("index.html");
            }, 1000);
        } else if(xmlHttp.status === 401){
            showMsg(xmlHttp.responseText);
        }
    };
    xmlHttp.open("post", "https://yicheng.me/todoapi/auth/userLogin");
    xmlHttp.setRequestHeader("content-type","application/json");
    xmlHttp.send(formData);
};


