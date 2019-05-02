<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i> 日志列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-input v-model="callName" placeholder="输入用户名" class="handle-input-1 mr10"></el-input>
            <el-input v-model="callApi" placeholder="输入接口URL" class="handle-input-2 mr10"></el-input>
            <el-date-picker v-model="timeRange" type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="search" :loading="searchLoading">搜索</el-button>
            <el-button type="primary" icon="el-icon-search" @click="export2Excel" :loading="exportLoading">搜索</el-button>
        </div>
        <el-table :data="logList" border
          v-loading="tableIsLoading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0.8, 0.8, 0.8, 0.8)"
          style="width: 100%">
            <el-table-column type="index" width="80" label="序号"></el-table-column>
            <el-table-column prop="username" label="调用人" width="120"></el-table-column>
            <el-table-column prop="callApi" label="调用接口" width="240"></el-table-column>
            <el-table-column prop="params" label="接收参数" width="200" :formatter="formatter" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="operation" label="接口描述" width="150"></el-table-column>
            <el-table-column prop="operationTime" label="调用时间" width="150"></el-table-column>
            <el-table-column prop="logLevel" label="日志级别" width="100"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
               </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination  @current-change="handleCurrentChange"
          :current-page.sync="currentPage" :page-size="pageSize"
          layout="prev, pager, next, jumper" :total="totalNum" >
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
import tripledesUtil from '@/util/tripledesUtil';
import dateFormatUtil from '@/util/dateFormatUtil'
export default {
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            totalNum: 100,
            callName:'',
            callApi:'',
            timeRange:'',
            startTime:'',
            endTime:'',
            logList: [],

            logID: -1,
            logIndex: -1,
            tableIsLoading:false,//是否显示表格加载动画
            searchLoading:false,//搜索按钮加载动画
            exportLoading:false,//导出按钮动画
            //删除提示框
            delVisible: false,
        }
    },
    watch: {
      callName:function(newVal,oldVal){
        this.tableIsLoading = true;
        this.searchLoading = true;
        this.getlogList();
      },
      callApi:function(newVal,oldVal){
        this.tableIsLoading = true;
        this.searchLoading = true;
        this.getlogList();
      },
      timeRange:function(newVal,oldVal){
        if(newVal){
          this.startTime = newVal[0];
          this.endTime = newVal[1];
          this.tableIsLoading = true;
          this.searchLoading = true;
          this.getlogList();
        }else{
          this.startTime = '';
          this.endTime = '';
          this.tableIsLoading = true;
          this.searchLoading = true;
          this.getlogList();
        }
      }
    },
    methods: {
        // 分页处理事件
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getlogList();
        },
        formatter(row, column, cellValue) {
            return JSON.stringify(cellValue);
        },
        //点击搜索
        search() {
          this.tableIsLoading = true;
          this.searchLoading = true;
          this.getlogList();
        },
        export2Excel(){

        },
        //点击删除按钮
        handleDelete(index, row) {
            this.logIndex = index;
            this.logID = row.logID;
            this.delVisible = true;
        },
        // 确定删除
        deleteRow() {
            api.delSystemLog({
                'logIdList':[this.logID]
            }).then((res) => {
                if (res.data.status == 'ok') {
                    this.logList.splice(this.logIndex, 1);
                    this.$message.success('删除成功');
                    this.delVisible = false;
                } else {
                    this.$message.info('删除失败');
                }
            }).catch((err) => {
                console.error(err);
            })
        },
        //获取用户列表
        getlogList() {
            var params = {
                "currentPage": this.currentPage,
                "pageSize": this.pageSize,
                "callName":this.callName,
                "callApi": this.callApi,
                "startTime":this.startTime,
                "endTime":this.endTime
            };
            api.getSystemLogList(params).then((res) => {
                if (res.data.status == 'ok') {
                    this.totalNum = res.data.info.totalNum;
                    this.logList = res.data.info.list;
                    this.tableIsLoading = false;
                    this.searchLoading = false;
                } else {
                    this.$message(res.data.errMsg)
                }
            }).catch((err) => {
                console.error(err);
            })
        }
    },
    created() {
        this.tableIsLoading = true;
        this.searchLoading = true;
        this.getlogList();
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
.handle-input-1 {
    width: 150px;
    display: inline-block;
}
.handle-input-2 {
    width: 300px;
    display: inline-block;
}

.del-dialog-cnt {
    font-size: 16px;
    text-align: center
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

.mgb20 {
    margin-bottom: 20px;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-cont span {
    font-size: 30px;
    color: #222;
    margin-left: 20px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
.avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
