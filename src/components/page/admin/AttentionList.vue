<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i> 关注列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <el-table :data="friendList" border style="width: 100%"
        v-loading="tableIsLoading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0.8, 0.8, 0.8, 0.8)"
        ref="multipleTable">
            <el-table-column type="index" width="80" label="序号"></el-table-column>
            <el-table-column prop="username" label="好友ID" width="120" sortable></el-table-column>
            <el-table-column prop="nickname" label="好友昵称" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="头像"  width="60">
              <template slot-scope="scope">
                <img :src="scope.row.avatar" class="user-avator" @click="viewAvatar(scope.row.avatar)">
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="好友手机" width="120"></el-table-column>
            <el-table-column prop="mail" label="好友邮箱" width="140"></el-table-column>
            <el-table-column prop="hobby" label="好友爱好" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="selfSign" label="好友签名" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="addTime" label="添加日期" width="140"></el-table-column>
            <el-table-column label="操作" width="80">
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
        <div class="del-dialog-cnt">确定删除？</div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>
    <!--图片预览弹框-->
    <el-dialog title="头像预览" :visible.sync="previewDialogVisible" modal :lock-scroll="false">
        <img :src="previewImgURL" class="pre-img"/>
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
            pageSize:10,
            totalNum:100,
            friendList:[],
            searchWords:'',
            friendID:0,
            friendIndex:0,
            //删除提示框
            delVisible: false,
            tableIsLoading:false,
            searchLoading:false,
            //预览弹框
            previewDialogVisible:false,
            previewImgURL:'',
            sortType:''
        }
    },
    watch: {
      searchWords:function(newVal,oldVal){
        this.getFriendList();
      }
    },
    methods: {
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
            this.friendID = row.roleID;//这里的roleID其实是FriendID(后台已做处理)
            this.delVisible = true;
        },
        // 确定删除
        deleteRow() {
          console.log(  this.friendID);
          api.delFriend({'friendID':this.friendID}).then((res)=>{
            if(res.data.status == 'ok'){
              this.friendList.splice(this.friendIndex, 1);
              this.$message.success('删除成功');
              this.delVisible = false;
            }else{
              this.$message.info('删除失败');
            }
          }).catch((err)=>{
             console.error(err);
          })
        },
        viewAvatar(avatar){
          this.previewImgURL = avatar;
          this.previewDialogVisible = true;
        },
        //获取列表
        getFriendList(){
          var params = {
            "sortType":this.sortType,
            "username":localStorage.getItem('ms_username'),
	          "currentPage":this.currentPage,
	          "pageSize":this.pageSize
           };
          api.getFriendList(params).then((res)=>{
            if(res.data.status){
              this.totalNum = res.data.info.totalNum
              this.friendList = res.data.info.list;
              //初始avatarURL
              let token = tripledesUtil.decrypt(localStorage.getItem('token'));
              for(let i=0;i<this.friendList.length;i++){
                this.friendList[i].avatar = this.friendList[i].avatar+'?token='+token;
              }
              this.searchLoading = false;
              this.tableIsLoading = false;
            }else{
              this.$message.info(res.data.info);
            }
          }).catch((err)=>{
              console.error(err);
          })
        }
    },
    created() {
      this.tableIsLoading = true;
      this.getFriendList();
    }
}
</script>

<style scoped>

.handle-select {
    width: 120px;
}

.del-dialog-cnt {
    font-size: 16px;
    text-align: center
}
.addBtn{
  margin-left:80px;
}
.user-avator{
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.pre-img{
  width: 400px;
  height: 400px;
  margin-left: 155px;
  border-radius: 50%;
}
</style>
