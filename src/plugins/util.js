export default {
  install(Vue) {
    Vue.prototype.timeStampToString = function (st, kind) {
      let date = new Date(parseInt(st));
      let Y = date.getFullYear();
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
      if(kind === "second"){
        let h = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();
        let m = date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes();
        let s = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds();
        let timeString = Y + '-' + M + '-' + D + ' ' + h + ":" + m + ":" + s;
        return (timeString);
      }
      if(kind === "day"){
        let timeString = Y + '-' + M + '-' + D;
        return (timeString);
      }
    }
  }
}
