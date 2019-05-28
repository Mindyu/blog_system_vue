<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 好友列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="searchWords" placeholder="输入用户名,昵称进行检索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search" :loading="searchLoading">搜索</el-button>
                <el-button type="success" icon="el-icon-check" @click="findUserDialog"
                           class="handle-right-btn">查找
                </el-button>
            </div>
            <el-table :data="friendList" border style="width: 100%"
                      v-loading="tableIsLoading" element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0.8, 0.8, 0.8, 0.8)"
                      ref="multipleTable">
                <el-table-column type="index" width="80" label="序号"></el-table-column>
                <el-table-column prop="username" label="好友ID" width="90" sortable></el-table-column>
                <el-table-column prop="nickname" label="好友昵称" width="90" show-overflow-tooltip></el-table-column>
                <el-table-column label="头像" width="60">
                    <template slot-scope="scope">
                        <img :src="getImgUrl(scope.row.avatar)" class="user-avator" @click="viewAvatar(scope.row)">
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="好友手机" width="120"></el-table-column>
                <el-table-column prop="email" label="好友邮箱" width="140"></el-table-column>
                <el-table-column prop="hobby" label="好友爱好" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sign" label="好友签名" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="created_at" label="添加日期" width="140" sortable></el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="sendPrivateMsg(scope.$index, scope.row)">私信
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange"
                               :current-page.sync="currentPage" :page-size="pageSize"
                               layout="prev, pager, next, jumper" :total="totalNum">
                </el-pagination>
            </div>
        </div>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        <!--图片预览弹框-->
        <el-dialog :title="dialogTitle" :visible.sync="previewDialogVisible" modal :lock-scroll="false">
            <img :src="previewImgURL" class="pre-img"/>
        </el-dialog>

        <!-- 私信弹出框 -->
        <el-dialog title="发送私信" :visible.sync="addVisible" width="40%" v-loading="addLoading">
            <el-form ref="addform" :model="addform" :rules="addRules" status-icon label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addform.username" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="私信内容">
                    <textarea v-model="addform.content" class="comment-form-content" name="" id="" cols="40" rows="10"
                              placeholder="内容"></textarea>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="replyMsg">发 送</el-button>
        </span>
        </el-dialog>

        <!-- 好友搜索框 -->
        <el-dialog title="寻找好友" :visible.sync="findVisible" width="80%" v-loading="findLoading">
            <div class="handle-box">
                <el-input v-model="findWords" placeholder="输入用户名,昵称进行搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="findUser" :loading="findLoading">搜索</el-button>
            </div>
            <el-table :data="userList" border style="width: 100%"
                      v-loading="dialogIsLoading" element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0.8, 0.8, 0.8, 0.8)"
                      ref="multipleTable">
                <el-table-column type="index" width="80" label="序号"></el-table-column>
                <el-table-column prop="username" label="用户名" width="120" sortable></el-table-column>
                <el-table-column prop="nickname" label="用户昵称" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="头像" width="60">
                    <template slot-scope="scope">
                        <img :src="getImgUrl(scope.row.avatar)" class="user-avator" @click="viewAvatar(scope.row)">
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="好友手机" width="140"></el-table-column>
                <el-table-column prop="email" label="好友邮箱" width="140"></el-table-column>
                <el-table-column prop="hobby" label="好友爱好" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sign" label="好友签名" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="created_at" label="添加日期" width="140"></el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleFriendRealtion(scope.$index, scope.row)">添加好友
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentPageChange"
                               :current-page.sync="currentUserPage"
                               layout="total, prev, pager, next, jumper"
                               :page-size="pageUserSize"
                               :total="totalUserNum">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="findVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/api';
    import tripledesUtil from '@/util/tripledesUtil'

    export default {
        data() {
            return {
                currentPage: 1,
                pageSize: 10,
                totalNum: 100,
                friendList: [],
                searchWords: '',
                friendName: 0,
                friendIndex: 0,
                imagePath:'',
                //删除提示框
                delVisible: false,
                tableIsLoading: false,
                searchLoading: false,
                //预览弹框
                previewDialogVisible: false,
                previewImgURL: '',
                sortType: '',
                dialogTitle: '',
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

                currentUserPage: 1,
                totalUserNum: 100,
                pageUserSize: 5,
                userList: [],
                // 搜索好友提示框
                findWords: '',
                findVisible: false,
                dialogIsLoading: false,
                findLoading: false,
            }
        },
        watch: {
            searchWords: function (newVal, oldVal) {
                this.getFriendList();
            },
            findWords: function (newVal, oldVal) {
                this.getUserInfoList();
            }
        },
        methods: {
            findUserDialog() {
                this.findVisible = true;
                this.getUserInfoList();
            },
            findUser() {
                this.getUserInfoList();
            },
            getUserInfoList() {
                var params = {
                    "current_page": this.currentUserPage,
                    "page_size": this.pageUserSize,
                    "search_words": this.findWords
                };
                api.getUserList(params).then((res) => {
                    if (res.data.status === 'ok') {
                        this.totalUserNum = res.data.info.totalNum;
                        this.userList = res.data.info.list;
                        this.dialogIsLoading = false;
                        this.findLoading = false;
                        //初始avatarURL
                        let token = tripledesUtil.decrypt(localStorage.getItem('token'));
                        for (let i = 0; i < this.userList.length; i++) {
                            this.userList[i].avatar = this.userList[i].avatar + '?token=' + token;
                        }
                    } else {
                        this.$message(res.data.errMsg)
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            handleFriendRealtion(index, row) {
                console.info(row.username);
                var params = {
                    'username_1': localStorage.getItem('ms_username'),
                    'username_2': row.username
                }
                api.addFriend(params).then((res) => {
                    if (res.data.status === 'ok') {
                        this.$message.success('添加好友成功');
                        this.getFriendList();
                    } else {
                        this.$message.info('添加好友失败');
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            // 分页处理事件
            handleCurrentPageChange(val) {
                this.currentUserPage = val;
                this.dialogIsLoading = true;
                this.getUserInfoList();
            },
            getImgUrl(val) {
                return api.uploadURL + val;
            },
            // 分页处理事件
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableIsLoading = true;
                this.getFriendList();
            },
            //点击搜索
            search() {
                this.searchLoading = true;
                this.tableIsLoading = true;
                this.getFriendList();
            },
            //点击删除按钮
            handleDelete(index, row) {
                this.friendIndex = index;
                this.friendName = row.username;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow() {
                console.log(this.friendName);
                var params = {
                    'data':{
                        'user_name': localStorage.getItem('ms_username'),
                        'friend_name': this.friendName
                    }
                };
                api.delFriend(params).then((res) => {
                    if (res.data.status === 'ok') {
                        this.friendList.splice(this.friendIndex, 1);
                        this.$message.success('删除成功');
                        this.delVisible = false;
                    } else {
                        this.$message.info('删除失败');
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            viewAvatar(row) {
                this.previewImgURL = this.imagePath + row.avatar;
                this.dialogTitle = '头像预览-' + row.username;
                this.previewDialogVisible = true;
            },
            //获取列表
            getFriendList() {
                var params = {
                    "username": localStorage.getItem('ms_username'),
                    "search_words": this.searchWords,
                    "current_page": this.currentPage,
                    "page_size": this.pageSize
                };
                api.getFriendList(params).then((res) => {
                    if (res.data.status) {
                        this.totalNum = res.data.info.totalNum
                        this.friendList = res.data.info.list;
                        //初始avatarURL
                        let token = tripledesUtil.decrypt(localStorage.getItem('token'));
                        for (let i = 0; i < this.friendList.length; i++) {
                            this.friendList[i].avatar = this.friendList[i].avatar + '?token=' + token;
                        }
                        this.searchLoading = false;
                        this.tableIsLoading = false;
                    } else {
                        this.$message.info(res.data.info);
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            sendPrivateMsg(index, row){
                this.addVisible = true;
                this.addform.username = row.username;
            },
            replyMsg(){
                this.addLoading = true;
                var params = {
                    "sender": localStorage.getItem("ms_username"),
                    "receiver": this.addform.username,
                    "msg_content": this.addform.content
                };
                api.addPrivateMsg(params).then((res) => {
                    this.addLoading = false;
                    if (res.data.status === 'ok') {
                        this.$message.success('发送成功');
                        this.addform.content = '';
                    }
                }).catch((err) => {
                    console.log('私信回复失败', res.data.err_msg);
                });
                this.addVisible = false;
            }
        },
        created() {
            this.tableIsLoading = true;
            this.imagePath = api.uploadURL;
            this.getFriendList();
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .handle-right-btn {
        float: right;
    }


    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .addBtn {
        margin-left: 80px;
    }

    .user-avator {
        width: 35px;
        height: 35px;
        border-radius: 50%;
    }

    .pre-img {
        width: 420px;
        height: 420px;
        margin-left: 155px;
        border-radius: 50%;
    }

    .comment-form-content {
        border: 1px solid #d2d2d2;
        padding: 1rem;
        font-size: 1.4rem;
        border-radius: .5rem;
    }
</style>
