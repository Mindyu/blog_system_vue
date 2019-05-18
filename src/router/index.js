import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const requireAuth = false;
const requireLogin = false;
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            component: resolve => require(['../components/page/front/index.vue'], resolve),
            children: [
                {
                    name: 'index',
                    path: '/index',
                    component: resolve => require(['../components/page/front/ArticleList.vue'], resolve),
                    meta: {requireAuth: false, requireLogin: false}
                },
                {
                    name: 'article',
                    path: '/article',
                    component: resolve => require(['../components/page/front/Article.vue'], resolve),
                    meta: {requireAuth: false, requireLogin: false}

                },
                {
                    name: 'tags',
                    path: '/tags',
                    component: resolve => require(['../components/page/front/Tags.vue'], resolve),
                    meta: {requireAuth: false, requireLogin: false}
                },
                {
                    name: 'about',
                    path: '/about',
                    component: resolve => require(['../components/page/front/About.vue'], resolve),
                    meta: {requireAuth: false, requireLogin: false}
                },
                {
                    name: 'feedback',
                    path: '/feedback',
                    component: resolve => require(['../components/page/front/Feedback.vue'], resolve),
                    meta: {requireAuth: false, requireLogin: false}
                },
            ]
        },
        {
            path: '/admin',
            redirect: '/dashboard'
        },
        {
            path: '/admin',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/admin/Dashboard.vue'], resolve),
                    meta: {title: '系统首页', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/bloglist',
                    component: resolve => require(['../components/page/admin/BlogList.vue'], resolve),
                    meta: {title: '博客管理', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/userlist',
                    component: resolve => require(['../components/page/admin/UserList.vue'], resolve),
                    meta: {title: '用户管理', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/commentlist',
                    component: resolve => require(['../components/page/admin/CommentList.vue'], resolve),
                    meta: {title: '评论管理', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/replylist',
                    component: resolve => require(['../components/page/admin/ReplyList.vue'], resolve),
                    meta: {title: '回复管理', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/privateMsg',
                    component: resolve => require(['../components/page/admin/PrivateMsg.vue'], resolve),
                    meta: {title: '私信列表', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/friendlist',
                    component: resolve => require(['../components/page/admin/Friendlist.vue'], resolve),
                    meta: {title: '好友列表', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/attentionlist',
                    component: resolve => require(['../components/page/admin/Attentionlist.vue'], resolve),
                    meta: {title: '关注列表', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    name: 'blogAdd',
                    path: '/blogAdd',
                    component: resolve => require(['../components/page/admin/BlogAdd.vue'], resolve),
                    meta: {title: '新增博客', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/systemlog',
                    component: resolve => require(['../components/page/admin/SystemLog.vue'], resolve),
                    meta: {title: '系统日志', requireAuth: requireAuth, requireLogin: true}
                },
                {
                    path: '/permissiomlist',
                    component: resolve => require(['../components/page/admin/PermissionList.vue'], resolve),
                    meta: {title: '权限管理', requireAuth: true, requireLogin: true}
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/admin/Login.vue'], resolve),
            meta: {requireAuth: false, requireLogin: false}
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve),
            meta: {requireAuth: false, requireLogin: false}
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/admin/403.vue'], resolve),
            meta: {requireAuth: false, requireLogin: false}
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
