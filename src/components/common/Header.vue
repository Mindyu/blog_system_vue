<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">博客后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip effect="dark" placement="bottom" :content="msgtip()" @onclick="restCount">
                        <router-link to="/privateMsg">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="messageCount"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator"><img src="/static/img/img.jpg" alt=""></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '@/api';
    import bus from '../common/bus';
    import {Notification} from 'element-ui';
    import tripledesUtil from '@/util/tripledesUtil';

    let VIL = (function () {
        let VIL = {};

        function DefaultWebSocket(host, call) {
            let _host = host;
            let _isOpen = false;
            let _bufQueue = [];
            let _bufCap = 100;
            let _call = null;
            if ("undefined" !== typeof call && call !== null) {
                _call = call
            } else {
                _call = {
                    onConnect: function (e) {
                        console.log("connect success ", e);
                    },
                    onDisconnect: function (e) {
                        console.log("disconnect ", e);
                    },
                    onMsg: function (data) {
                        console.log("receive message ", data)
                    }
                }
            }

            let _socket = new WebSocket(_host);
            _socket.binaryType = "arraybuffer";
            /**
             * 设置发送消息缓存队列的容量
             * @param {number} cap
             * @constructor
             */
            this.setBufferCap = function (cap) {
                if ("number" !== typeof cap) {
                    console.error("parameter type is not number ");
                    return;
                }
                if (cap < 0) {
                    console.error("parameter value can not less then 0");
                    return;
                }
                _bufCap = cap;
            };

            /**
             * 发送消息
             * @param {string | ArrayBuffer } data
             * @constructor
             */
            this.send = function (data) {
                if (_isOpen && _socket) {
                    _socket.send("-");
                } else {
                    if (_bufQueue < _bufCap) {
                        _bufQueue.push(data);
                    }
                }
            };

            this.close = function () {
                _socket.close(1000, "normal");
            };

            _socket.onopen = function (even) {
                _isOpen = true;
                _call.onConnect(even);
                while (_bufQueue > 0) {
                    _socket.send(_bufQueue.shift());
                }
            };

            _socket.onmessage = function (e) {
                let data = e.data;
                _call.onMsg(data);
            };

            /**
             * 收到关闭连接
             * @param even
             */
            _socket.onclose = function (even) {
                _isOpen = false;
                _call.onDisconnect({host: _host, event: even});
            };

            /**
             * 收到错误
             * @param err
             */
            _socket.onerror = function (err) {
                _isOpen = false;
                _call.onDisconnect({host: _host, event: err});
            };
        }

        try {
            VIL.EngineSocket = DefaultWebSocket;
        } catch (e) {
            console.error("VILEngine error ", e);
        }

        return VIL;
    })();

    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: '未知',
                messageCount: 2
            }
        },
        computed: {
            username() {
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods: {
            restCount(){
                this.messageCount = 0;
                console.info(this.messageCount);
            },
            msgtip() {
                return this.messageCount ? "有" + this.messageCount + "条未读消息" : "消息中心";
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command === 'loginout') {
                    localStorage.clear();
                    this.$router.push('/login');
                }
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            getNotReadMsg() {
                var params = {
                    "username": localStorage.getItem('ms_username'),
                };
                api.getNotReadMsg(params).then((res) => {
                    if (res.data.status === 'ok') {
                        this.messageCount = res.data.info.length;
                    }
                }).catch((err) => {
                    console.log('获取日志数量', res.data.err_msg);
                });
            },
        },
        created() {
            this.getNotReadMsg();
            let isConnect = false;
            let handler = {
                onConnect: function (e) {
                    isConnect = true;
                    console.log("handler connect success ", e);
                    let se = setInterval(function () {
                        if (isConnect === false) {
                            clearInterval(se);
                        }
                        console.log("setInterval", Date.now());
                        socket.send("web browser setInterval");
                    }, 55000)
                },
                onDisconnect: function (e) {
                    isConnect = false;
                    console.log("handler disconnect ", e);
                },
                onMsg: function (data) {
                    console.log("handler receive message ", data);
                    this.messageCount += 1;
                    Notification({
                        showClose: true,
                        message: data,
                        type: 'success',
                        duration: 2000
                    });
                }
            };

            let authToken = tripledesUtil.decrypt(localStorage.getItem('token'));
            if (authToken) {
                var socket = new VIL.EngineSocket("ws://127.0.0.1:8081/ws?token=" + authToken, handler);
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .header-right {
        float: right;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 70px;
        align-items: center;
    }

    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .btn-bell, .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }

    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator {
        margin-left: 20px;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
