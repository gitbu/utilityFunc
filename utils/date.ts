import { isString, isNumber } from './type';

type dataType = any

const format = function (data: dataType, fmt: string) {
  if (!data) return '';

  const FUTURE_TIMESTAMP = new Date('3000/01/01 00:00:00').getTime();

  let date;
  if (
    isNumber(data) && data * 1000 < FUTURE_TIMESTAMP
  ) {
    date = data * 1000;
  }
  if (isString(data)) {
    // 这里是为了兼容ios遇到2020-02-20 14:07:30格式的时间会不兼容
    date = data.replace(/\-/g, '/');
  }

  data = new Date(date);

  const o = {
    "M+": data.getMonth() + 1, //月份
    "d+": data.getDate(), //日
    "h+": data.getHours(), //小时
    "m+": data.getMinutes(), //分
    "s+": data.getSeconds(), //秒
    "q+": Math.floor((data.getMonth() + 3) / 3), //季度
    "S": data.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) { 
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }

  return fmt;
}

export default {
  format
}