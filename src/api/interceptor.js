/*
* 为axios配置拦截器,统一处理所有http请求和响应
* 主要功能是实现登录拦截，当后台验证token失败，或token失效时拦截需要用户重新登录
*/
import axios from 'axios'
import tripledesUtil from '@/util/tripledesUtil'

// axios 配置
axios.defaults.timeout = 5000; //5s的超时时间  如果错误提示未cancel说明请求超时

// http request 拦截器  将token添加到请求头里,方便后台验证
axios.interceptors.request.use(
    //请求之前的配置
    config => {
        let authToken = tripledesUtil.decrypt(localStorage.getItem('token'));
        if(authToken){
          console.log("token",authToken);
          config.headers.Authorization =  authToken;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    //返回响应的预处理
    response => {
      return response;
    },
    //返回异常的预处理
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401: sessionStorage.clear();
                          alert('身份已过期，请重新登录');
                          localStorage.clear();
                          window.location.pathname = '/login';
                          break;
            }
        }
        return Promise.reject(error.response)
    });

export default axios;
