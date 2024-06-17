
import axios from 'axios';
import { to } from "./promise.js";
//取消请求Token
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
//请求实例
const http = axios.create({
  cancelToken: source.token,
  timeout: 30000,
  baseURL: '/'
});

// 请求拦截
http.interceptors.request.use(config => {
  if (!config.noLoading) loadingGif();
  const token = sessionStorage.getItem('token');
  token && (config.headers.Authorization = token);
  return config;
}, err => Promise.reject(err));

// 响应拦截
http.interceptors.response.use(
  response => {
    if (!response.config.noLoading) loadingGif();
    const respData = response.data;
    if (response.status === 200) {
      if (respData.code === 0) {
        // alert('错误信息')
      }
      return respData;
    } else {
      return Promise.reject(response);
    }
  },
  err => {
    if (!err.config.noLoading) loadingGif(false);
    const response = err.response;
    switch (response.status) {
      case 401: {
        break;
      }
      case 404: {
        break;
      }
      case 500: {
        break;
      }
      default: {

      }
    }
    return Promise.reject(err);
  }
);
function loadingGif() {

}
export default {
  baseURL: http.defaults.baseURL,
  //get
  async get(url, params = {}, config = {}) {
    const [err, res] = await to(http.get(url, params, config));
    return { err, res };
  },
  //post
  async post(url, data = {}, config = {}) {
    const [err, res] = await to(http.post(url, data, config));
    return { err, res };
  }
}