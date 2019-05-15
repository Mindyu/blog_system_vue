<template>
    <div class="errorBox">
        <el-form status-icon :model="error" :rules="rules" ref="errorForm" onsubmit="return false">
            <el-form-item prop="errorMsg">
                <el-col :span="19" :offset="2">
                    <el-input type="textarea" v-model="error.errorMsg" :rows="10" placeholder="请详细描述你遇到的问题，我们会第一时间解决"/>
                </el-col>
            </el-form-item>
            <el-form-item prop="contact" :inline-message="true">
                <el-col :span="19" :offset="2">
                    <el-input v-model="error.contact" placeholder="请留下你的QQ邮箱，格式:zhangsan@qq.com"/>
                </el-col>
            </el-form-item>
        </el-form>
        <el-button type="primary" class="feedback" @click="submitError('errorForm')">确 定</el-button>
    </div>
</template>
<script>
    import api from '@/api';

    export default {
        name: 'error',
        data() {
            var validContact = (rule, value, callback) => {
                if (value === '') return callback(new Error(' '));
                if (value.indexOf('@') >= 1) { //邮箱前缀最短为1
                    callback();
                } else {
                    return callback(new Error('邮箱输入有误'));
                }
            };
            return {
                error: {
                    errorMsg: '',
                    contact: '',
                },
                rules: {
                    errorMsg: [{
                        required: true,
                        message: ' ',
                        trigger: 'blur'
                    }],
                    contact: [{
                        validator: validContact,
                        trigger: 'blur'
                    }],
                }
            }
        },
        methods: {
            submitError(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.error.errorMsg = '';
                        this.error.contact = '';
                        this.$message.success('感谢您的配合');
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>
<style>
    .errorBox {
        margin: 10px auto;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        padding: 20px 25px;
        border: 1px solid #eaeaea;
        background: #FFFFFF;
        color: #344A5F;
        box-shadow: 1px 1px 1px;
    }

    .feedback {
        margin-left: 60px;
        width: 110px;
        font-size: 15px;
    }
</style>
