<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-if="operateType === 'add'"><i class="el-icon-circle-plus"></i> 添加博客
                </el-breadcrumb-item>
                <el-breadcrumb-item v-else><i class="el-icon-edit-outline"></i> 编辑博客</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <el-form ref="addBlogForm" :model="addForm" :rules="addRules" status-icon label-width="100px">
                    <el-form-item label="博客标题:" prop="blog_title">
                        <el-input v-model="addForm.blog_title" class="blog_title"></el-input>
                    </el-form-item>
                    <el-form-item label="文章类别:" prop="type_id">
                        <el-select placeholder="选中类别" v-model="addForm.type_id" class="handle-select mr10">
                            <template v-for='type in blogTypeList'>
                                <el-option :key="type.id" :label="type.type_name" :value="type.id"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字:" prop="keywords">
                        <el-tag :key="tag" v-for="tag in addForm.keywords" closable :disable-transitions="false"
                                @close="handleClose(tag)" class="el-tag">{{tag}}
                        </el-tag>
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
                    <el-form-item label-width="0px" prop="blog_content">
                        <mavon-editor v-model="addForm.blog_content" ref="md" @imgAdd="$imgAdd" @change="change"
                                      style="min-height: 600px"/>
                    </el-form-item>
                    <!-- 博客附件上传
                    <el-form-item label-width="0px">
                        <el-upload class="upload-demo" drag
                                   :on-success="handleAvatarSuccess"
                                   :on-progress="getFileUploadProgress"
                                   :action="uploadURL" :auto-upload="true" :limit="2">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将博客附件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-form-item>-->
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
    import {Loading} from 'element-ui';

    export default {
        data: function () {
            return {
                html: '',
                configs: {},
                uploadURL: '',
                imagePath: '',
                inputVisible: false,
                inputValue: '',
                blogTypeList: [],
                addForm: {
                    id: '',
                    blog_title: '',
                    keywords: [],
                    blog_content: '',
                    type_id: '',
                    personal: false,
                },
                addRules: {
                    blog_title: [{required: true, message: '请输入博客标题', trigger: 'blur'}],
                    keywords: [{required: true, message: '请输入关键词', trigger: 'blur'}],
                    blog_content: [{required: true, message: '请输博客正文', trigger: 'blur'}],
                    type_id: [{required: true, message: '请选中博客类别', trigger: 'blur'}],
                },
                operateType: 'add',
                blog_id: '',
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
                this.$axios({
                    url: this.uploadURL,
                    method: 'post',
                    data: formdata,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                }).then((result) => {
                    this.$refs.md.$img2Url(pos, this.imagePath + result.data.info);
                })
            },
            handleAvatarSuccess(res, file) {
                console.log(file);
                this.$message.success('上传成功');
            },
            getFileUploadProgress(event, file, fileList) {
                console.log(file);
            },
            change(value, render) {
                // render 为 markdown 解析后的结果
                this.html = render;
            },
            submit() {
                console.log(this.addForm.blog_content);
                console.log(this.html);
                console.log(this.addForm);
                this.$refs['addBlogForm'].validate((valid) => {
                    if (valid) {
                        let loadingInstance = Loading.service({fullscreen: true});
                        if (this.operateType === 'edit') {
                            var params = {
                                "id": this.addForm.id,
                                "blog_title": this.addForm.blog_title,
                                "keywords": this.addForm.keywords.toString(),
                                "blog_content": this.addForm.blog_content,
                                "type_id": this.addForm.type_id,
                                "personal": this.addForm.personal === true ? 0 : 1,
                                "author": localStorage.getItem('ms_username')
                            };
                            api.editBlogInfo(params).then((res) => {
                                if (res.data.status === 'ok') {
                                    this.$message.success('提交成功！');
                                    this.$router.push('/bloglist');
                                    bus.$emit('refreshBlogList');
                                } else {
                                    this.$message.warning('提交失败！');
                                }
                                // 以服务的方式调用的 Loading 需要异步关闭
                                this.$nextTick(() => {
                                    loadingInstance.close();
                                });
                            }).catch((err) => {
                                console.error(err);
                            });
                        } else {
                            var params = {
                                "blog_title": this.addForm.blog_title,
                                "keywords": this.addForm.keywords.toString(),
                                "blog_content": this.addForm.blog_content,
                                "type_id": this.addForm.type_id,
                                "personal": this.addForm.personal === true ? 0 : 1,
                                "author": localStorage.getItem('ms_username')
                            };
                            api.addBlog(params).then((res) => {
                                if (res.data.status === 'ok') {
                                    this.$message.success('提交成功！');
                                    this.$router.push('/bloglist');
                                    bus.$emit('refreshBlogList');
                                } else {
                                    this.$message.warning('提交失败！');
                                }
                                // 以服务的方式调用的 Loading 需要异步关闭
                                this.$nextTick(() => {
                                    loadingInstance.close();
                                });
                            }).catch((err) => {
                                console.error(err);
                            })
                        }
                    }
                })
            },
            handleClose(tag) {
                this.addForm.keywords.splice(this.addForm.keywords.indexOf(tag), 1);
            },
            showInput() {
                if (this.addForm.keywords.length >= 5) {
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
                    this.addForm.keywords.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            //或取博客所有类别
            getBlogType() {
                api.getBlogType().then((res) => {
                    if (res.data.status === 'ok') {
                        this.blogTypeList = res.data.info;
                    } else {
                        this.$message(res.data.errMsg)
                        //console.log(res.data.errMsg);
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            getBlogByID() {
                api.getBlogByID({'blogID': this.blog_id}).then((res) => {
                    if (res.data.status === 'ok') {
                        this.addForm = res.data.info;
                        this.addForm.keywords = this.addForm.keywords.split(',');
                        this.addForm.personal = this.addForm.personal !== 1;
                    } else {
                        this.$message.info(res.data.info);
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            saveTemp() {
                this.$message.success('此功能暂不支持');
            },
            resetData() {
                this.addForm = {
                    id: '',
                    blog_title: '',
                    keywords: [],
                    blog_content: '',
                    type_id: '',
                    personal: false,
                };
                this.operateType = 'add';
                this.blog_id = '';
                this.inputValue = '';
                this.inputVisible = false;
            },
            initData() {
                this.resetData();//重置数据
                this.operateType = this.$route.query.operate;
                this.blog_id = this.$route.query.blog_id;
                this.getBlogType();
                if (this.operateType === 'edit') {
                    //获取博客详情并回显
                    this.getBlogByID();
                    this.$route.meta.title = '编辑博客';
                } else {
                    this.$route.meta.title = '新增博客';
                }
            }
        },
        created() {
            this.uploadURL = api.uploadURL + 'upload';
            this.imagePath = api.uploadURL;
            bus.$on('refreshData', msg => {
                this.initData();
            })
        },
        mounted() {
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

    .blog_title {
        width: 280px;
    }

    .el-tag {
        margin-right: 10px;
    }
</style>
