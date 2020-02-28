/**
 * 组件库基本上不需要自己区请求数据，当组件内部需要去请求数据时，就一定需要小心了，该情况请再三确认。
 *
 * 以下简单封装XMLHttpRequest，以Promise的形式
 */

/**
  * get请求
  * @param {string} url - 请求地址
  * @param {Object} [header] - 请求头，字符串键值对：{'Content-Type': 'application/x-www-form-urlencoded'}
  * @return {Promise} -
  *   成功返回一个 {httpStatus, resData}
  *     httpStatus {number} 表示请求的http返回码，如200、500、304等；
  *     resData {string} 表示请求返回的数据
  *   错误返回整个 XMLHTTPRequest对象
  */
 export function httpGet (url, header) {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = () => {
      try {
        let data = JSON.parse(request.responseText)
        resolve({ httpStatus: request.status, data })
      } catch (error) {
        resolve({ httpStatus: request.status, data: request.responseText })
      }
    }
    request.onerror = () => reject(request)
    if (header && typeof header === 'object') {
      const headerLen = Object.keys(header)
      headerLen.forEach(function (v) {
        request.setRequestHeader(v, header[v])
      })
    }
    request.send()
  })
}

/**
 * post 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {Object} [header] - 请求头，字符串键值对：{'Content-Type': 'application/x-www-form-urlencoded'}
 * @return {Promise} -
 *   成功返回一个 {httpStatus, resData}
 *     httpStatus {number} 表示请求的http返回码，如200、500、304等；
 *     resData {string} 表示请求返回的数据
 *   错误返回整个 XMLHTTPRequest对象 或 错误信息
 */
export function httpPost (url, data, header) {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest()
    request.open('POST', url, true)
    if (header && typeof header === 'object') {
      const headerLen = Object.keys(header)
      headerLen.forEach(function (v) {
        request.setRequestHeader(v, header[v])
      })
    }
    request.onload = () => {
      try {
        let data = JSON.parse(request.responseText)
        resolve({ status: request.status, data })
      } catch (error) {
        resolve({ status: request.status, data: request.responseText })
      }
    }
    request.onerror = () => reject(request)
    request.send(data)
  })
}

interface JsonpOptions {
  prefix?: string
  param?: string
  timeout?: number
  data?: {
    [key: string]: any
  }
}

enum HTTP_STATUS {
  SUCESS = 0,
  FAIL = -1,
  TIMEOUT = 504
}

interface JsonpResponse {
  status: HTTP_STATUS
  message: string
  data: {
    [key: string]: any
  }
}

/**
 * 
 * @param url 请求地址
 * @param opts 请求参数
 * @return {Promise}
 */

export function jsonp(url: string, opts: JsonpOptions = {}) {
  // 实现Promise化
  return new Promise((resolve, reject) => {
    //设置默认参数
    const { 
      prefix = '__jp',
      param = 'callback',
      timeout = 60000,
      data = {}
    } = opts;
    const script = document.createElement('script');
    const callbackName = prefix + Date.now() + Math.ceil(Math.random()*1e10);
    const response: JsonpResponse = {
      status: HTTP_STATUS.SUCESS,
      message: '',
      data: {},
    };
    let timer;

    //清除script标签以及注册的全局函数以及超时定时器
    function cleanup() { // 清除函数
      if (script.parentNode) {
        script.parentNode.removeChild(script);
        window[callbackName] = null;
        if (timer) {
          clearTimeout(timer);
        }
      }
    }

    // 超时处理
    if (timeout) { // 超时
      timer = setTimeout(() => {
        cleanup();
        response.status = HTTP_STATUS.TIMEOUT;
        response.message = 'timeout';
        reject(response);
      }, timeout);
    }

    // 注册全局函数，等待执行中...
    window[callbackName] = res => {
      // 只要这个函数一执行，就表示请求成功，可以使用清除函数了
      if (window[callbackName]) {
        cleanup();
      }
      if (res) {
        response.status = HTTP_STATUS.SUCESS;
        response.message = 'ok';
        response.data = res;
        resolve(response);
      } else {
        response.status = HTTP_STATUS.FAIL;
        response.message = 'failed';
        reject(response)
      }
    }

    // 以下将data对象格式的参数拼接到url的后面
    let str = '';
    for (const key in data) {
      const value = data[key] !== undefined ? data[key] : '';
      str += `&${key}=${encodeURIComponent(value)}`;
    }

    // 拼接script url
    url = url.indexOf('?') > 0 ? url + str.substr(0) : url + '?' + str.substr(1);
    // 最后加上与服务端协商的jsonp请求字段
    url = `${url}&${param}=${callbackName}`;
    script.src = url;

    script.addEventListener('error', err => {
      cleanup();
      response.status = HTTP_STATUS.FAIL;
      response.message = 'error';
      reject(response);
    })
    // 以下这条执行且成功后，全局等待函数就会被执行
    document.head.appendChild(script);
  })
}
