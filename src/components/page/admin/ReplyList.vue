<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 回复列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del " @click="delAll">批量删除</el-button>
                <el-input v-model="searchWords" placeholder="输入用户名进行检索" class="handle-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search" :loading="searchLoading">搜索</el-button>
            </div>
            <el-table :data="replyList" border style="width: 100%"
                      v-loading="tableIsLoading" element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0.8, 0.8, 0.8, 0.8)"
                      ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="80" label="序号"></el-table-column>
                <el-table-column prop="from_username" label="回复人" width="180"></el-table-column>
                <el-table-column prop="to_username" label="被回复人" width="180"></el-table-column>
                <el-table-column prop="reply_content" label="回复内容" width="280" show-overflow-tooltip></el-table-column>
                <el-table-column prop="created_at" label="回复时间" width="150"></el-table-column>
                <el-table-column label="操作" width="140">
                    <template slot-scope="scope">
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
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/api';

    export default {
        data() {
            return {
                currentPage: 1,
                pageSize: 10,
                totalNum: 100,
                replyList: [],
                searchWords: '',
                replyID: 0,
                commentIndex: 0,
                multipleSelection: [],//多选
                //删除提示框
                delVisible: false,
                tableIsLoading: false,
                searchLoading: false,
            }
        },
        watch: {
            searchWords: function (newVal, oldVal) {
                this.getCommentReplyList();
            }
        },
        methods: {
            // 分页处理事件
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableIsLoading = true;
                this.getCommentReplyList();
            },
            //点击搜索
            search() {
                this.searchLoading = true;
                this.tableIsLoading = true;
                this.getCommentReplyList();
            },
            //点击删除按钮
            handleDelete(index, row) {
                this.commentIndex = index;
                this.replyID = row.id;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow() {
                api.delCommentReplyByID({'replyID': this.replyID}).then((res) => {
                    if (res.data.status == 'ok') {
                        this.replyList.splice(this.commentIndex, 1);
                        this.$message.success('删除成功');
                        this.delVisible = false;
                    } else {
                        this.$message.info('删除失败');
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            //删除选中的
            delAll() {
                const length = this.multipleSelection.length;
                if (length <= 0) {
                    this.$message.success('请选择需要删除的选项');
                    return;
                }
                this.$confirm('确认删除选中的' + length + '条评论吗？', '警告', {type: 'warning', lockScroll: false}).then(() => {
                    let replyIdList = [];
                    for (var i = 0; i < length; i++) {
                        replyIdList.push(this.multipleSelection[i].id);
                    }
                    api.delCommentReplyList({'replyIdList': replyIdList}).then((res) => {
                        if (res.data.status == 'ok') {
                            this.$message.success('删除了' + length + '条评论');
                            this.multipleSelection = [];
                            this.getCommentReplyList();
                        } else {
                            this.$message.info(res.data.info);
                        }
                    }).catch((err) => {
                        console.error(err);
                    })
                }).catch((err) => {
                    console.log(err);
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //获取评论列表
            getCommentReplyList() {
                var params = {
                    'comment_id': 0,
                    'search_words': this.searchWords,
                    "current_page": this.currentPage,
                    "page_size": this.pageSize
                };
                api.getCommentReplyList(params).then((res) => {
                    if (res.data.status) {
                        this.totalNum = res.data.info.totalNum
                        this.replyList = res.data.info.list;
                        this.searchLoading = false;
                        this.tableIsLoading = false;
                    } else {
                        this.$message.info(res.data.info);
                    }
                }).catch((err) => {
                    console.error(err);
                })
            }
        },
        created() {
            this.tableIsLoading = true;
            this.getCommentReplyList();
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

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .addBtn {
        margin-left: 80px;
    }
</style>
