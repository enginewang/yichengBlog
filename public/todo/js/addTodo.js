var todoList = [];

(function () {

    var datepicker = window.datepicker;

    var monthData;
    var $wrapper;
    //渲染函数，由于没有使用第三方插件或库，所以使用的是模板拼接的方法
    datepicker.buildUi = function (year, month) {
        monthData = datepicker.getMonthDate(year, month);
        var html = '<div class="ui-datepicker-header">' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' +
            '<span class="datepicker-curr-month">'+monthData.year+'-'+monthData.month+'</span>' +
            '</div>' +
            '<div class="ui-datepicker-body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '<th>日</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';

        for (var i = 0; i < monthData.days.length; i++) {
            var date = monthData.days[i];
            if (i % 7 === 0) {
                html += '<tr>';
            }
            html += '<td data-date="'+date.date+'">' + date.showDate + '</td>';
            if (i % 7 === 6) {
                html += '</tr>';
            }
        }

        html+='</tbody>' +
            '</table>'+
            '</div>';
        return html;
    };
    //日历渲染函数
    datepicker.render = function (direction) {
        var year, month;
        if (monthData) {
            year = monthData.year;
            month = monthData.month;
        }

        if (direction === 'prev') month--;
        if (direction === 'next') month++;

        var html = datepicker.buildUi(year,month);

        $wrapper=document.querySelector('.ui-datepicker-wrapper');

        if(!$wrapper){
            $wrapper = document.createElement('div');
            $wrapper.className = 'ui-datepicker-wrapper';
        }

        $wrapper.innerHTML = html;

        document.body.appendChild($wrapper);

    };
    //初始换函数
    datepicker.init = function (input) {
        datepicker.render();

        var $input=document.querySelector(input);
        var isOpen=false;
        //给input框赋予点击事件
        $input.addEventListener('click',function(){
            if(isOpen){
                $wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen=false;
            }else{
                $wrapper.classList.add('ui-datepicker-wrapper-show');

                var left=$input.offsetLeft;
                var top=$input.offsetTop;
                var height=$input.offsetHeight;

                $wrapper.style.top=top+height+2+'px';
                $wrapper.style.left=left+'px';

                isOpen=true;
            }
        },false);
        //给按钮添加点击事件
        $wrapper.addEventListener('click',function(e){
            var $target=e.target;

            if(!$target.classList.contains('ui-datepicker-btn')){
                return false;
            }

            //上一月,下一月
            if($target.classList.contains('ui-datepicker-prev-btn')){
                datepicker.render('prev');
            }else if($target.classList.contains('ui-datepicker-next-btn')){
                datepicker.render('next');
            }
        },false);

        $wrapper.addEventListener('click',function(e){
            var $target= e.target;

            if($target.tagName.toLocaleLowerCase()!=='td'){
                return false;
            }

            var date=new Date(monthData.year,monthData.month-1,$target.dataset.date);

            $input.value=format(date);

            $wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen=false;

        },false);
    };
    //格式化数据
    function format(date){
        var ret='';

        var padding=function(num){
            if(num<=9){
                return '0'+num;
            }
            return num;
        };

        ret+=date.getFullYear()+'-';
        ret+=padding(date.getMonth()+1)+'-';
        ret+=padding(date.getDate());

        return ret;
    }

})();

function addTodo() {
    var validForm = true;
    var text = document.getElementById("inputTaskName").value;
    if (text === ""){
        showMsg("请填写内容");
        validForm = false;
    }
    var date = document.getElementsByClassName("datepicker")[0].value;
    if (date === ""){
        showMsg("请填写时间");
        validForm = false;
    }
    if (validForm){
        //console.log(new Date(date.split("-")).getTime());
        var dateTS = new Date(date.split("-")).getTime();
        var nowTS = new Date().getTime();
        var iid = document.getElementById("important-select");
        var important = parseInt(iid.options[iid.selectedIndex].value);
        var uid = document.getElementById("urgent-select");
        var urgent = parseInt(uid.options[uid.selectedIndex].value);
        var todo = {
            text: text,
            date: dateTS,
            createTime: nowTS,
            completed: false,
            important: important,
            urgent: urgent,
        };
        if (localStorage.getItem("todo")){
            todos = JSON.parse(localStorage.getItem("todo"));
        } else {
            todos = []
        }
        todos.push(todo);
        console.log(todos);
        localStorage.setItem("todo", JSON.stringify(todos));
        var newTodo = JSON.stringify({todo: JSON.stringify(todos)});
        uploadTodo();
        setTimeout(function () {
            window.location.replace("index.html");
        }, 1000);
    }
}

window.onload = function () {
    flushLang();
    flushTheme();
};

