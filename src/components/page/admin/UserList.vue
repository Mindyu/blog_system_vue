<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-circle-plus" class="handle-del mr10" @click="addVisible = true">新增</el-button>
            <el-select placeholder="类别筛选" v-model="userTypeID" clearable class="handle-select mr10" @change="handleSelectChange">
                <template v-for='type in userTypeList'>
                    <el-option :key="type.id" :label="type.note" :value="type.id"></el-option>
                </template>
            </el-select>
            <el-input v-model="searchWords" placeholder="输入用户名,昵称进行检索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search" :loading="searchLoading">搜索</el-button>
        </div>
        <el-table :data="userList" border
          v-loading="tableIsLoading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0.8, 0.8, 0.8, 0.8)"
          style="width: 100%">
            <el-table-column type="index" width="80" label="序号"></el-table-column>
            <el-table-column prop="username" label="用户名" width="100"></el-table-column>
            <el-table-column prop="nickname" label="昵称" width="100"></el-table-column>
            <el-table-column prop="phone" label="手机" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
            <el-table-column prop="birthday" label="生日" width="100"></el-table-column>
            <el-table-column prop="created_at" label="注册时间" width="150"></el-table-column>
            <el-table-column prop="role_id" label="身份" width="100" :formatter="formatter"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="handleView(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
               </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="currentPage"
                         layout="total, sizes, prev, pager, next, jumper"
                         :page-sizes="[10, 20, 50]"
                         :page-size="pageSize"
                         :total="totalNum" >
          </el-pagination>
        </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%" center>
        <el-form ref="form" :model="form" label-width="50px">
            <el-form-item label="昵称">
                <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker v-model="form.birthday" type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="form.role_id" placeholder="请选择">
                    <el-option v-for="item in userTypeList" :key="item.id" :label="item.note" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="签名">
                <el-input v-model="form.sign"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="新增" :visible.sync="addVisible" width="40%" v-loading="addLoading">
        <el-form ref="addform" :model="addform" :rules="addRules" status-icon label-width="70px">
            <el-form-item label="头像">
              <el-col :span="12">
                <el-upload class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :headers="avatarHeader"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-col>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addform.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addform.password"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="addform.nickname"></el-input>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="addform.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="addform.email"></el-input>
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker v-model="addform.birthday"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="学历">
                <el-select v-model="addform.education" placeholder="请选择" value="">
                    <el-option value="专科">专科</el-option>
                    <el-option value="本科">本科</el-option>
                    <el-option value="硕士">硕士</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="签名">
                <el-input v-model="addform.sign"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>

    <!--详情弹出框-->
    <el-dialog title="用户信息详情" :visible.sync="detailVisible" width='40%' :lockScroll='false'>
        <el-card shadow="hover" class="mgb20">
            <div class="user-info">
                <img :src="userDetail.avatar" class="user-avator" alt="">
                <div class="user-info-cont">
                    <span>{{userDetail.username}}</span>
                    <span style="margin-left:20px">{{this.roleMap[userDetail.role_id]}}</span>
                </div>
            </div>
            <div class="user-info-list">
                <span>昵称:{{userDetail.nickname}}</span>
                <span style="margin-left:60px">生日:{{userDetail.birthday}}</span>
                <span style="margin-left:84px">手机:{{userDetail.phone}}</span>
            </div>
            <div class="user-info-list">
                <span>教育:{{userDetail.education}}</span>
                <span style="margin-left:30px">邮箱:{{userDetail.email}}</span>
                <span style="margin-left:20px">爱好:{{userDetail.hobby}}</span>
            </div>
            <div class="user-info-list">
                <span>签名:{{userDetail.sign}}</span>
            </div>
        </el-card>
    </el-dialog>
</div>
</template>

<script>
import api from '@/api';
import tripledesUtil from '@/util/tripledesUtil'
export default {
    data() {
        var validUsername = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('用户名不能为空'));
          }else{
            api.validUsername({
              'username':this.addform.username,
            }).then((res)=>{
              if(res.data.status ==='ok'){
                if(res.data.info === true){
                  callback();
                }else{
                  return callback(new Error('用户名已被注册'));
                }
              }else{
                  console.error(res.data.errorMsg);
                  return callback(new Error('用户名验证失败'));
              }
            }).catch((err)=>{
               console.error(err);
            });
          }
        };
        return {
            currentPage: 1,
            pageSize: 10,
            totalNum: 100,
            userTypeID: '',
            searchWords: '',
            userList: [],
            userTypeList: [],
            userID: -1,
            userIndex: -1,
            tableIsLoading:false,//是否显示表格加载动画
            searchLoading:false,//搜索按钮加载动画
            addLoading:false,//点击添加按钮后加载
            //详情
            userDetail: '',
            detailVisible: false,
            //编辑框
            editVisible: false,
            //编辑框数据
            form: {},
            //删除提示框
            delVisible: false,
            //新增
            addVisible: false,
            uploadURL:'',
            imageUrl: '',
            avatarHeader:{},//图片上传请求头
            addform: {
                username: '',
                password: '',
                nickname: '',
                avatar: '',
                phone: '',
                email: '',
                birthday: '',
                education: '本科',
                hobby: '',
                sign: ''
            },
            addRules: {
                username: [{
                   validator: validUsername,
                   trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
            },
            roleMap:{
                0:"未知",
                1:"普通用户",
                2:"管理员",
                3:"超级管理员",
            }
        }
    },
    watch: {
      searchWords:function(newVal,oldVal){
        this.tableIsLoading = true;
        this.searchLoading = true;
        this.getUserList();
      }
    },
    methods: {
        // 分页处理事件
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getUserList();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getUserList();
        },
        //博客类别选中后触发事件
        handleSelectChange(val) {
            this.getUserList();
        },
        //点击搜索
        search() {
          this.tableIsLoading = true;
          this.searchLoading = true;
          this.getUserList();
        },
        //点击删除按钮
        handleDelete(index, row) {
            this.userIndex = index;
            this.userID = row.id;
            this.delVisible = true;
        },
        // 确定删除
        deleteRow() {
            api.delUserByID({
                'userID': this.userID
            }).then((res) => {
                if (res.data.status === 'ok') {
                    this.userList.splice(this.userIndex, 1);
                    this.$message.success('删除成功');
                    this.delVisible = false;
                } else {
                    this.$message.info('删除失败');
                }
            }).catch((err) => {
                console.error(err);
            })
        },
        //用户身份格式化
        formatter(row, column, cellValue) {
            return this.roleMap[cellValue];
        },
        handleView(index, row) {
            this.detailVisible = true;
            this.userDetail = row;
        },
        handleEdit(index, row) {
            this.userIndex = index;
            this.form = this.userList[index];
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            const params = this.form;
            api.editUserInfo(params).then((res) => {
                if (res.data.status === 'ok') {
                    this.editVisible = false;
                    this.$message.success('编辑成功');
                    this.$set(this.userList, this.userIndex, this.form);
                } else {
                    this.$message.info('编辑失败');
                }
            }).catch((err) => {
                this.$message.info('编辑用户信息出错');
                console.error(err);
            })
        },
        //获取用户列表
        getUserList() {
            var params = {
                "current_page": this.currentPage,
                "page_size": this.pageSize,
                "role_id": this.userTypeID === '' ? 0 : this.userTypeID,
                "search_words": this.searchWords
            };
            api.getUserList(params).then((res) => {
                if (res.data.status === 'ok') {
                    this.totalNum = res.data.info.totalNum;
                    this.userList = res.data.info.list;
                    this.tableIsLoading = false;
                    this.searchLoading = false;
                    //初始avatarURL
                    let token = tripledesUtil.decrypt(localStorage.getItem('token'));
                    for(let i=0;i<this.userList.length;i++){
                      this.userList[i].avatar = this.userList[i].avatar+'?token='+token;
                    }
                } else {
                    this.$message(res.data.errMsg)
                }
            }).catch((err) => {
                console.error(err);
            })
        },
        //或取博客所有类别
        getUserType() {
            api.getUserType().then((res) => {
                if (res.data.status === 'ok') {
                    this.userTypeList = res.data.info;
                } else {
                    this.$message(res.data.errMsg);
                }
            }).catch((err) => {
                console.error(err);
            })
        },
        addUser() {
          this.$refs['addform'].validate((valid) => {
            if (valid) {
             this.addLoading = true;
             api.addUser(this.addform).then((res)=>{
               if(res.data.status === 'ok'){
                 this.addVisible = false;
                 this.addLoading = false;
                 this.$message.success('添加成功');
                 this.getUserList();
                 this.imageUrl = '';
                 this.addform = {
                     username: '',
                     password: '',
                     nickname: '',
                     avatar: '',
                     phone: '',
                     email: '',
                     birthday: '',
                     education: '本科',
                     hobby: '',
                     sign: ''
                 };
               }else{
                 this.$message.info(res.data.errMsg);
               }
             }).catch((err)=>{
                this.$message.info('添加用户出错');
                console.error(err);
             })
           }
         })
        },
        handleAvatarSuccess(res, file) {
            //console.log(file);
            this.imageUrl = URL.createObjectURL(file.raw);
            this.addform.avatar = file.response.info;
            this.$message.success('上传成功');
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    },
    created() {
        this.tableIsLoading = true;
        this.searchLoading = true;
        this.getUserList();
        this.getUserType();
        this.uploadURL = api.uploadURL;
        this.avatarHeader.userID = 1;
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
