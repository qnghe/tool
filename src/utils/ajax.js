
import axios from 'axios';
//取消请求Token
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
//请求实例
const http = axios.create({
    cancelToken: source.token
});
// 超时
http.defaults.timeout = 30 * 1000;
http.defaults.baseURL = '/';

// 请求拦截
http.interceptors.request.use(config => {
    if(!config.noLoading) loadingGif();
    // config.headers['Authorization'] = Vue.prototype.$userInfo.getLoginInfo().token;
    return config;
}, err => Promise.reject(err));
// 响应拦截
http.interceptors.response.use(
    response => {
        if(!response.config.noLoading) loadingGif();
        //凭证相关
        const respData = response.data;
        const { error } = respData;
        if (respData.code && respData.code !== 0) {
            // Vue.prototype.$message.error(respData.message);
            return respData;
        } else if (error) {
            // Vue.prototype.$message.error(respData);
            return Promise.reject(respData.message ? respData.message : response);
        } else {
            return respData;
        }
    },
    err => {
        if (!err.config.noLoading) loadingGif(false);
        if (err && err.response) {
            const response = err.response;
            const error = response.error || '';
            if (response.status == 401) {

            } else if (response.status == 403) {

            } else {

                // Vue.prototype.$message.error(message || '网络错误,请稍后再试!')
            }
        } else {
            // Vue.prototype.$message.error('网络异常，请稍后再试或联系管理员!')
        }
        return Promise.reject(err)
    }
);
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