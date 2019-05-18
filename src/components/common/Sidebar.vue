<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" v-if="hasAuthView(subItem.auth)">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-if="hasAuthView(item.auth)">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                authMap:{
                    "user":0,
                    "admin":1,
                    "superadmin":2
                },
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: 'dashboard',
                        title: '系统首页',
                        auth: 0
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'bloglist',
                        title: '博客管理',
                        auth: 0
                    },
                    {
                        icon: 'el-icon-news',
                        index: 'userlist',
                        title: '用户管理',
                        auth: 1
                    },
                    {
                        icon: 'el-icon-message',
                        index: 'message',
                        title: '消息管理',
                        subs: [
                            {
                                index: 'commentlist',
                                title: '评论管理',
                                auth: 0
                            },
                            {
                                index: 'replylist',
                                title: '回复管理',
                                auth: 0
                            },
                            {
                                index: 'privateMsg',
                                title: '私信列表',
                                auth: 0
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-mobile-phone',
                        index: 'friendlist',
                        title: '我的好友',
                        auth: 0
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'attentionlist',
                        title: '我的关注',
                        auth: 0
                    },
                    {
                        icon: 'el-icon-date',
                        index: 'systemlog',
                        title: '系统日志',
                        auth: 1
                    },
                    {
                        icon: 'el-icon-warning',
                        index: 'permissiomlist',
                        title: '权限管理',
                        auth: 2
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        methods:{
          hasAuthView(val){
              var role = localStorage.getItem("role");
              return this.authMap[role] >= val
          }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
