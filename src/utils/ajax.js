
import Vue from 'vue';
import axios from 'axios';
//取消请求Token
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
//请求实例
const http = axios.create({
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    cancelToken: source.token
});
// 超时
http.defaults.timeout = 30 * 1000;

// test
http.defaults.baseURL = '/';

// 请求拦截
http.interceptors.request.use(config => {
    // if(!config.noLoading) loadingGif(true);
    // config.headers['Authorization'] = Vue.prototype.$userInfo.getLoginInfo().token;
    return config;
}, err => Promise.reject(err));
// 响应拦截
http.interceptors.response.use(
    response => {
        // if(!response.config.noLoading) loadingGif(false);
        //凭证相关
        if (response.config.ignore) {
            return response
        } else {
            const dataAxios = response.data
            const { error } = dataAxios
            if (dataAxios.code && dataAxios.code !== 0) {
                Vue.prototype.$message.error(dataAxios.message);
                return dataAxios
            } else if (error) {
                Vue.prototype.$message.error(dataAxios);
                return Promise.reject(dataAxios.message ? dataAxios.message : response);
            } else {
                return dataAxios
            }
        }
    },
    err => {
        if (!err.config.noLoading) loadingGif(false);
        if (err && err.response) {
            let response = err.response;
            let message = response.data && response.data.error && (response.data.error.details || response.data.error.message) || '';
            if (response.status == 401) {

                return
            } else if (response.status == 403) {

            } else {
                Vue.prototype.$message.error(message || '网络错误,请稍后再试!')
            }
        } else {
            Vue.prototype.$message.error('网络异常，请稍后再试或联系管理员!')
        }
        return Promise.reject(err)
    }
);
// eslint-disable-next-line
function loadingGif() {
    
}
export default {
    baseURL: http.defaults.baseURL,
    //get
    get(url, params = {}, config = {}) {
        return http.get(url, params, config);
    },
    //post
    post(url, data = {}, config = {}) {
        return http.post(url, data, config)
    }
}