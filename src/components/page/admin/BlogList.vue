<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i> 博客列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-circle-plus" @click="addBlog">新增</el-button>
            <el-select placeholder="类别筛选" v-model="blogTypeID" clearable class="handle-select mr10" @change="handleSelectChange">
                <template v-for = 'type in blogTypeList'>
                    <el-option :key="type.id" :label="type.type_name" :value="type.id"></el-option>
                </template>
            </el-select>
            <el-input v-model="searchWords" placeholder="输入标题，关键字，作者进行检索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search" :loading="isLoading">搜索</el-button>
        </div>
        <el-table :data="blogList" border style="width: 100%" ref="multipleTable"
          v-loading="tableIsLoading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0.8, 0.8, 0.8, 0.8)">
            <el-table-column type="index" width="80" label="序号"></el-table-column>
            <el-table-column prop="blog_title" label="标题" width="180"></el-table-column>
            <el-table-column prop="keywords" label="关键字" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type_id" label="类别"  width="150" :formatter="typeFormatter"></el-table-column>
            <el-table-column prop="author" label="作者" width="100"></el-table-column>
            <el-table-column prop="personal" label="状态" width="100" :formatter="formatter"></el-table-column>
            <el-table-column prop="created_at" label="日期"  width="150" :formatter="dateFormat" ></el-table-column>
            <el-table-column label="操作" width="185">
                <template slot-scope="scope">
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
import bus from '@/components/common/bus';
import moment from "moment";
export default {
    data() {
        return {
            currentPage: 1,
            pageSize:10,
            totalNum:100,
            blogTypeID:'',
            searchWords:'',
            blogList:[],
            blogTypeList:[],
            blogID:-1,
            blogIndex:-1,
            //删除提示框
            delVisible: false,
            tableIsLoading:false,
            isLoading:false
        }
    },
    watch: {
      searchWords:function(newVal,oldVal){
        this.tableIsLoading = true;
        this.getBlogList();
      }
    },
    methods: {
        // 分页处理事件
        handleCurrentChange(val) {
          this.tableIsLoading = true;
          this.currentPage = val;
          this.getBlogList();
        },
        handleSizeChange(val) {
            this.tableIsLoading = true;
            this.pageSize = val;
            this.getBlogList();
        },
        //获取博客列表
        getBlogList() {
          var params ={
              "current_page": this.currentPage,
              "page_size": this.pageSize,
              "blog_type_id": this.blogTypeID === ''? 0:this.blogTypeID,
              "search_words": this.searchWords
          };
          api.getBlogList(params).then((res)=>{
            if(res.data.status === 'ok'){
              this.totalNum = res.data.info.totalNum;
              this.blogList = res.data.info.list;
              this.tableIsLoading = false;
              this.isLoading = false;
            }else{
              this.$message(res.data.errMsg)
              //console.log(res.data.errMsg);
            }
          }).catch((err)=>{
            console.error(err);
          })
        },
        //获取博客所有类别
        getBlogType(){
          api.getBlogType().then((res)=>{
            if(res.data.status === 'ok'){
              this.blogTypeList = res.data.info;
            }else{
              this.$message(res.data.errMsg)
              //console.log(res.data.errMsg);
            }
          }).catch((err)=>{
            console.error(err);
          })
        },
        //博客类别选中后触发事件
        handleSelectChange(val){
          this.tableIsLoading = true;
          this.getBlogList();
        },
        //点击搜索
        search() {
          this.isLoading = true;
          this.tableIsLoading = true;
          this.getBlogList();
        },
        //点击删除按钮
        handleDelete(index, row) {
            this.blogIndex = index;
            this.blogID = row.id;
            this.delVisible = true;
        },
        // 确定删除
        deleteRow() {
          api.delBlogByID({'blogID':this.blogID}).then((res)=>{
            if(res.data.status === 'ok'){
              this.blogList.splice(this.blogIndex, 1);
              this.$message.success('删除成功');
              this.delVisible = false;
            }else{
              this.$message.info('删除失败');
            }
          }).catch((err)=>{
             console.error(err);
          })
        },
        //日期格式化
        formatter(row, column,cellValue) {
          if(cellValue === 1){
            return "公开";
          }else{
            return "私有";
          }
        },
        //时间格式化  
        dateFormat:function(row, column) {
            var date = row[column.property];
            if (date === undefined) {
                return "";
            }
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
        },
        typeFormatter(row, column,cellValue){
          for(var i=0;i<this.blogTypeList.length;i++){
            if(cellValue === this.blogTypeList[i].id){
              return this.blogTypeList[i].type_name;
            }
          }
          return cellValue;
        },
        handleEdit(index, row) {
            this.$router.push({ name:'blogAdd',query:{'operate': 'edit','blog_id':row.id}});
            bus.$emit('refreshData');
        },
        addBlog(){
            this.$router.push({ name:'blogAdd',query:{'operate': 'add'}});
            bus.$emit('refreshData');
        }
    },
    created() {
        this.tableIsLoading = true;
        this.getBlogList();
        this.getBlogType();
        bus.$on('refreshBlogList', msg => {
           this.tableIsLoading = true;
           this.getBlogList();
        })
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
</style>
