<template>
<div>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-if="operateType == 'add'"><i class="el-icon-circle-plus"></i> 添加博客</el-breadcrumb-item>
            <el-breadcrumb-item v-else><i class="el-icon-edit-outline"></i> 编辑博客</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div>
            <el-form ref="addBlogForm" :model="addForm" :rules="addRules" status-icon label-width="100px">
                <el-form-item label="博客标题:" prop="blogTitle">
                    <el-input v-model="addForm.blogTitle" class="blogTitle"></el-input>
                </el-form-item>
                <el-form-item label="文章类别:" prop="typeID">
                    <el-select placeholder="选中类别" v-model="addForm.typeID" class="handle-select mr10">
                        <template v-for = 'type in blogTypeList'>
                            <el-option :key="type.typeID" :label="type.typeName" :value="type.typeID"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键字:" prop="keyWords">
                  <el-tag :key="tag" v-for="tag in addForm.keyWords" closable :disable-transitions="false"
                  @close="handleClose(tag)" class="el-tag">{{tag}}</el-tag>
                    <el-input class="input-new-tag"
                     v-if="inputVisible"
                     v-model="inputValue" ref="saveTagInput" size="small"
                     @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">
                      <i class="el-icon-circle-plus"></i>关键字
                    </el-button>
                </el-form-item>
                <el-form-item label="设为私有:">
                  <el-switch v-model="addForm.personal" active-color="#13ce66"></el-switch>
                </el-form-item>
                <el-form-item label-width="0px" prop="blogContent">
                  <mavon-editor v-model="addForm.blogContent" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px" />
                </el-form-item>
                <el-form-item label-width="0px">
                  <el-upload class="upload-demo" drag
                    :on-success="handleAvatarSuccess"
                    :on-progress ="getFileUploadProgress"
                    :action="uploadURL" :auto-upload="false" :limit="2">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将博客附件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <el-button class="editor-btn" type="primary" @click="saveTemp">保存草稿</el-button>
        <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
    </div>
</div>
</template>

<script>
import api from '@/api';
import {mavonEditor} from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import bus from '@/components/common/bus';
import { Loading } from 'element-ui';
export default {
    data: function() {
        return {
            html: '',
            configs: {},
            uploadURL:'',
            inputVisible: false,
            inputValue: '',
            blogTypeList:[],
            addForm: {
              blogID:'',
              blogTitle:'',
              keyWords:[],
              blogContent:'',
              typeID:'',
              personal:false,
            },
            addRules: {
              blogTitle: [{required: true,message: '请输入博客标题',trigger: 'blur'}],
              keyWords: [{required: true,message: '请输入关键词',trigger: 'blur'}],
              blogContent: [{required: true,message:'请输博客正文',trigger: 'blur'}],
              typeID: [{required: true,message: '请选中博客类别',trigger: 'blur'}],
            },
            operateType:'add',
            blogID:'',
        }
    },
    components: {
        mavonEditor
    },
    methods: {
        // 将图片上传到服务器，返回地址替换到md中
        $imgAdd(pos, $file) {
            var formdata = new FormData();
            formdata.append('file', $file);
            // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
            this.$axios({
                url: '/common/upload',
                method: 'post',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }).then((url) => {
                this.$refs.md.$img2Url(pos, url);
            })
        },
        handleAvatarSuccess(res, file) {
            //console.log(file);
            this.imageUrl = URL.createObjectURL(file.raw);
            this.addform.avatar = file.response.info;
            this.$message.success('上传成功');
        },
        getFileUploadProgress(event, file, fileList){
          console.log(file);
        },
        change(value, render) {
            // render 为 markdown 解析后的结果
            this.html = render;
        },
        submit() {
            console.log(this.addForm.blogContent);
            console.log(this.html);
            console.log(this.addForm);
            this.$refs['addBlogForm'].validate((valid) => {
              if (valid) {
                let loadingInstance = Loading.service({ fullscreen: true });
                if(this.operateType == 'edit'){
                  var params = {
                    "blogID":this.addForm.blogID,
                    "blogTitle":this.addForm.blogTitle,
                    "keyWords":this.addForm.keyWords.toString(),
                    "blogContent":this.addForm.blogContent,
                    "typeID":this.addForm.typeID,
                    "personal":this.addForm.personal == true? 0:1,
                  }
                  api.editBlogInfo(params).then((res)=>{
                    if(res.data.status == 'ok'){
                      this.$message.success('提交成功！');
                      this.$router.push('/bloglist');
                      bus.$emit('refreshBlogList');
                    }else{
                      this.$message.warning('提交失败！');
                    }
                    // 以服务的方式调用的 Loading 需要异步关闭
                    this.$nextTick(() => {
                      loadingInstance.close();
                    });
                  }).catch((err)=>{
                     console.error(err);
                  });
                }else{
                  var params = {
                    "blogTitle":this.addForm.blogTitle,
                    "keyWords":this.addForm.keyWords.toString(),
                    "blogContent":this.addForm.blogContent,
                    "typeID":this.addForm.typeID,
                    "personal":this.addForm.personal == true? 0:1,
                    "author":localStorage.getItem('ms_username')
                   }
                   api.addBlog(params).then((res)=>{
                     if(res.data.status == 'ok'){
                       this.$message.success('提交成功！');
                       this.$router.push('/bloglist');
                       bus.$emit('refreshBlogList');
                     }else{
                       this.$message.warning('提交失败！');
                     }
                     // 以服务的方式调用的 Loading 需要异步关闭
                     this.$nextTick(() => {
                       loadingInstance.close();
                     });
                   }).catch((err)=>{
                      console.error(err);
                   })
                }
              }
            })
        },
        handleClose(tag) {
            this.addForm.keyWords.splice(this.addForm.keyWords.indexOf(tag), 1);
        },
        showInput() {
            if(this.addForm.keyWords.length >= 5){
              this.$message.info('关键词最多添加5个');
              return;
            }
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //输入关键词后确定
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
              this.addForm.keyWords.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        //或取博客所有类别
        getBlogType(){
          api.getBlogType().then((res)=>{
            if(res.data.status == 'ok'){
              this.blogTypeList = res.data.info;
            }else{
              this.$message(res.data.errMsg)
              //console.log(res.data.errMsg);
            }
          }).catch((err)=>{
            console.error(err);
          })
        },
        getBlogByID(){
          api.getBlogByID({'blogID':this.blogID}).then((res)=>{
            if(res.data.status == 'ok'){
              this.addForm = res.data.info;
              this.addForm.keyWords = this.addForm.keyWords.split(',');
              this.addForm.personal = this.addForm.personal == 1 ? false:true;
            }else{
              this.$message.info(res.data.info);
            }
          }).catch((err)=>{
             console.error(err);
          })
        },
        saveTemp(){
          this.$message.success('此功能暂不支持');
        },
        resetData(){
          this.addForm={
            blogID:'',
            blogTitle:'',
            keyWords:[],
            blogContent:'',
            typeID:'',
            personal:false,
          };
          this.operateType = 'add';
          this.blogID = '';
          this.inputValue = '';
          this.inputVisible = false;
        },
        initData(){
          this.resetData();//重置数据
          this.operateType = this.$route.query.operate;
          this.blogID = this.$route.query.blogID;
          this.getBlogType();
          if(this.operateType == 'edit'){
             //获取博客详情并回显
             this.getBlogByID();
             this.$route.meta.title = '编辑博客';
          }else{
             this.$route.meta.title = '新增博客';
          }
        }
    },
    created(){
      this.uploadURL = api.uploadURL;
      bus.$on('refreshData', msg => {
         this.initData();
      })
    },
    mounted(){
      this.initData();
    }
}
</script>
<style scoped>
.editor-btn {
    margin-top: 20px;
}

.button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.blogTitle{
  width: 280px;
}
.el-tag {
  margin-right:10px;
}
</style>
