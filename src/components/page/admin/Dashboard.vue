<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20 userinfo" v-model="userDetail">
                            <div class="user-info">
                                <img v-if="userDetail" :src="formatUrl(userDetail.avatar)" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{userDetail.username}}</div>
                                    <div>{{role}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">手机：<span>{{userDetail.phone}}</span></div>
                            <div class="user-info-list">邮箱：<span>{{userDetail.email}}</span></div>
                            <div class="user-info-list">生日：<span>{{userDetail.birthday}}</span></div>
                            <div class="user-info-list">学历：<span>{{userDetail.education}}</span></div>
                            <div class="user-info-list">爱好：<span>{{userDetail.hobby}}</span></div>
                            <div class="user-info-list">签名：<span>{{userDetail.sign}}</span></div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{accessCount}}</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{logCount}}</div>
                                    <div>系统日志数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <div class="chart" id="mainChart"></div>

                <!--<el-card shadow="hover" :body-style="{ height: '304px'}">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="add">添加</el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">
                                    {{scope.row.title}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="80">
                            <template slot-scope="scope">
                                <i class="el-icon-delete" @click="del(scope.$index, scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>-->

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import api from '@/api';
    var echarts = require('echarts')

    export default {
        data() {
            return {
                userDetail: '',
                imagePath: '',
                logCount:0,
                accessCount:0,
                statsList:[],
                todoList: [
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: true,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: true,
                    }
                ]
            }
        },
        computed: {
            role() {
                return localStorage.getItem('role') === 'admin' ? '管理员' : '普通用户';
            }
        },
        mounted() {
            this.getAccessStats();
        },
        methods: {
            add() {
                this.$notify({
                    title: '添加',
                    message: '代办事项添加还在开发中..',
                    type: 'success'
                });
            },
            del(index, row) {
                this.$delete(this.todoList, index);
                this.$message.success('删除成功');
            },
            formatUrl(val) {
                return this.imagePath + val;
            },
            getUserInfo() {
                var params = {
                    "username": localStorage.getItem('ms_username'),
                };
                api.getUserInfo(params).then((res) => {
                    if (res.data.status === 'ok') {
                        this.userDetail = res.data.info;
                    } else {
                        this.$message.warning(res.data.info);
                    }
                }).catch((err) => {
                    console.log('获取用户信息出错', res.data.err_msg);
                });
            },
            getLogCount(){
                api.getSystemLogCount().then((res) => {
                    if (res.data.status === 'ok') {
                        this.logCount = res.data.info;
                    }
                }).catch((err) => {
                    console.log('获取日志数量', res.data.err_msg);
                });
            },
            getAccessCount(){
                api.getSystemAccessCount().then((res) => {
                    if (res.data.status === 'ok') {
                        this.accessCount = res.data.info;
                    }
                }).catch((err) => {
                    console.log('获取系统访问量失败', res.data.err_msg);
                });
            },
            getAccessStats(){
                api.getSystemAccessWeek().then((res) => {
                    if (res.data.status === 'ok') {
                        this.initChart(res.data.info);
                    }
                }).catch((err) => {
                    console.log('获取访问量统计表失败', res.data.err_msg);
                });
            },
            initChart(data){
                //echarts 实例化
                var myChart = echarts.init(document.getElementById('mainChart'));
                // 基于准备好的dom，初始化echarts实例
                myChart.setOption({
                    title: { text: '访问量统计' },
                    tooltip: {},
                    xAxis: {
                        data: data["day"].split(","),
                    },
                    yAxis: {},
                    series: [{
                        name: '访问量',
                        type: 'line',
                        data: data["count"].split(","),
                    }]
                });
            }
        },
        created() {
            this.imagePath = api.uploadURL;
            this.getUserInfo();
            this.getLogCount();
            this.getAccessCount();
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 28px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 24px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 50px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .userinfo {
        height: 525px;
    }

    .chart {
        width: 100%;
        height: 400px;
        padding-top: 10px;
    }
</style>
