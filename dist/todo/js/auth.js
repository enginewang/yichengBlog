// 注册表单提交
function submitRegister()
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
            showMsg("注册成功！即将跳转到登录页面");
            setTimeout(function () {
                window.location.replace("login.html");
            }, 2000);
        } else if(xmlHttp.status === 204) {
            showMsg("这个用户名已经存在了，请换一个用户名！");
        }
    };
    xmlHttp.open("post", "http://167.179.66.112:1323/api/register");
    xmlHttp.setRequestHeader("content-type","application/json");
    xmlHttp.send(formData);
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
                window.location.replace("index.html");
            }, 1000);
        } else if(xmlHttp.status === 401){
            showMsg(xmlHttp.responseText);
        }
    };
    xmlHttp.open("post", "http://167.179.66.112:1323/api/auth/userLogin");
    xmlHttp.setRequestHeader("content-type","application/json");
    xmlHttp.send(formData);
};


