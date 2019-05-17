import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';  // 浅绿色主题
import './assets/css/img/iconfont.css';
import "babel-polyfill";
import VueParticles from 'vue-particles'

Vue.use(ElementUI, {size: 'small'});
Vue.use(VueParticles)
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const username = localStorage.getItem('ms_username');
    const token = localStorage.getItem('token');
    //如果用户没登陆则跳转到登录页，如果主动退出也一样
    if (to.meta.requireLogin) {
        if (username && token) {
            // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
            if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
                Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                    confirmButtonText: '确定'
                });
            }
            if (to.meta.requireAuth) {
                const role = localStorage.getItem('role');
                role === 'admin' ? next() : next('/403');
            } else {
                next();
            }
        } else {
            next('/login');
        }
    } else {
        next();
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
