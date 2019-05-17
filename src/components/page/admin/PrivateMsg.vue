<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 私信列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="unreadLable()" name="first">
                    <el-table :data="unreadMsg" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title"
                                      @click="showMsg(scope.row)">{{formatMsg(scope.row.sender)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index, scope.row)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleReadAll()">全部标为已读</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="readLable()" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="readMsg" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="showMsg(scope.row)">{{formatMsg(scope.row.sender)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="showMsg(scope.row)">{{formatMsg(scope.row.sender)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog title="私信" :visible.sync="msgVisible" width="500px" center>
            <div class="dialog-sender">{{msg.sender}}：</div>
            <div class="dialog-cnt">{{msg.msg_content}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="reply(msg.sender)">回 复</el-button>
                <el-button @click="msgVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="私信回复" :visible.sync="addVisible" width="40%" v-loading="addLoading">
            <el-form ref="addform" :model="addform" :rules="addRules" status-icon label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addform.username" :readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="回复内容">
                    <textarea v-model="addform.content" class="comment-form-content" name="" id="" cols="40" rows="10"
                              placeholder="回复内容"></textarea>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="replyMsg">回 复</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/api';

    export default {
        data() {
            return {
                message: 'first',
                showHeader: false,
                unreadMsg: '',
                readMsg: '',
                msg: '',
                msgVisible: false,
                readonly: true,
                recycle: [{
                    msg_content: "【系统通知】提醒您，今晚凌晨2-3会进行系统升级！",
                    sender: "系统通知",
                }],
                addLoading: false, //点击添加按钮后加载
                addVisible: false,
                addform: {
                    username: '',
                    content: ''
                },
                addRules: {
                    content: [{
                        required: true,
                        message: '请输入回复内容',
                        trigger: 'blur'
                    }],
                },
            }
        },
        methods: {
            handleRead(index, row) {
                const item = this.unreadMsg.splice(index, 1);
                api.setMsgRead({
                    "id": row.id
                }).then((res) => {
                    if (res.data.status === 'ok') {
                        this.$message.success('消息已阅');
                    }
                }).catch((err) => {
                    console.log('设置消息已阅失败', res.data.err_msg);
                });
                this.readMsg = item.concat(this.readMsg);
            },
            handleReadAll() {
                const unread = this.unreadMsg;
                this.unreadMsg = [];
                this.readMsg = this.readMsg.concat(unread);
            },
            handleDel(index) {
                const item = this.readMsg.splice(index, 1);
                this.recycle = item.concat(this.recycle);
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1);
                this.readMsg = item.concat(this.readMsg);
            },
            formatMsg(val) {
                return "【" + val + "】向你发来了一条私信";
            },
            getNotReadMsg() {
                var params = {
                    "username": localStorage.getItem('ms_username'),
                };
                api.getNotReadMsg(params).then((res) => {
                    if (res.data.status === 'ok') {
                        this.unreadMsg = res.data.info;
                    }
                }).catch((err) => {
                    console.log('获取日志数量', res.data.err_msg);
                });
            },
            getReadMsg() {
                var params = {
                    "username": localStorage.getItem('ms_username'),
                };
                api.getReadMsg(params).then((res) => {
                    if (res.data.status === 'ok') {
                        this.readMsg = res.data.info;
                    }
                }).catch((err) => {
                    console.log('获取日志数量', res.data.err_msg);
                });
            },
            unreadLable() {
                return "未读消息(" + this.unreadMsg.length + ")";
            },
            readLable() {
                return "已读消息(" + this.readMsg.length + ")";
            },
            showMsg(row) {
                this.msgVisible = true;
                this.msg = row
            },
            reply(user) {
                this.msgVisible = false;
                this.addVisible = true;
                this.addform.username = user;
            },
            replyMsg() {
                this.addLoading = true;
                var params = {
                    "sender": localStorage.getItem("ms_username"),
                    "receiver": this.addform.username,
                    "msg_content": this.addform.content
                };
                api.addPrivateMsg(params).then((res) => {
                    this.addLoading = false;
                    if (res.data.status === 'ok') {
                        this.$message.success('回复成功');
                        this.addform.content = '';
                    }
                }).catch((err) => {
                    console.log('私信回复失败', res.data.err_msg);
                });
                this.addVisible = false;
            }
        },
        created() {
            this.getNotReadMsg();
            this.getReadMsg();
        }
    }

</script>

<style>
    .message-title {
        cursor: pointer;
    }

    .handle-row {
        margin-top: 30px;
    }

    .dialog-sender {
        font-size: 24px;
        font-style: initial;
        margin-left: 50px;
    }

    .dialog-cnt {
        font-size: 16px;
        text-align: center;
        margin-top: 30px;
    }

    .comment-form-content {
        border: 1px solid #d2d2d2;
        padding: 1rem;
        font-size: 1.4rem;
        border-radius: .5rem;
    }

</style>
