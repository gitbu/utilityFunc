
const PHONE_STOCK_BASE_URL = 'client://client.html?action=ymtz^webid=2804^url=';

const locationHref = (url: string) => {
  location.href = url;
} 


// 这个函数是一个业务函数，跳转到手抄的一个webview窗口
const loadThisPageInNewWebViewWindow = (url: string, baseUrl: string = PHONE_STOCK_BASE_URL) => {
  const _url = `${baseUrl}${url}`;
  locationHref(_url);
}

export {
  locationHref,
  loadThisPageInNewWebViewWindow,
}