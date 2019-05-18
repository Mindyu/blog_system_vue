<template>
    <div class="login-wrap">
        <div class="ms-title">博客后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')" :loading="isLoading">登录</el-button>
                </div>
                <div class="register-btn">
                    <el-button type="text" @click="isVisible = true">注册</el-button>
                </div>
            </el-form>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="注册" :visible.sync="isVisible" width="40%" v-loading="addLoading" center>
            <el-form ref="addform" :model="addform" :rules="addRules" status-icon label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addform.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addform.password"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="addform.nickname"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="validCode">
                    <el-col :span="12">
                        <el-input v-model="addform.validCode"></el-input>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <Identify :identifyCode="identifyCode"></Identify>
                    </el-col>
                    <el-col :span="5">
                        <el-button @click="refreshCode" icon="el-icon-refresh">刷新</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="isVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/api';
    import tripledesUtil from '@/util/tripledesUtil';
    import Identify from './Identify'

    export default {
        data() {
            var validUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                } else {
                    api.validUsername({
                        'username': this.addform.username,
                    }).then((res) => {
                        if (res.data.status === 'ok') {
                            if (res.data.info === true) {
                                callback();
                            } else {
                                return callback(new Error('用户名已被注册'));
                            }
                        } else {
                            console.error(res.data.errorMsg);
                            return callback(new Error('用户名验证失败'));
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            };
            var codeValidator = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入验证码'));
                } else {
                    if (value !== this.identifyCode) {
                        return callback(new Error('验证码输入有误'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                isLoading: false,
                ruleForm: {
                    username: 'mindyu',
                    password: '123456'
                },
                rules: {
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }]
                },
                isVisible: false,
                addLoading: false,
                addform: {
                    username: '',
                    password: '',
                    nickname: '',
                    validCode: ''
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
                    nickname: [{
                        required: true,
                        message: '请输入昵称',
                        trigger: 'blur'
                    }],
                    validCode: [{
                        validator: codeValidator,
                        trigger: 'blur'
                    }],
                },
                identifyCodes: "1234567890",
                identifyCode: ""
            }
        },
        components: {
            Identify
        },
        methods: {
            addUser() {
                this.$refs['addform'].validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        api.addUser(this.addform).then((res) => {
                            if (res.data.status === 'ok') {
                                this.isVisible = false;
                                this.addLoading = false;
                                this.$message.success('注册成功');
                                this.addform = {
                                    username: '',
                                    password: '',
                                    nickname: '',
                                };
                            } else {
                                this.$message.info(res.data.errMsg);
                            }
                        }).catch((err) => {
                            this.$message.info('注册用户出错');
                            console.error(err);
                        })
                    }
                })
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        var params = {
                            "username": this.ruleForm.username,
                            "password": this.ruleForm.password
                        };
                        api.getToken(params).then((res) => {
                            if (res.data.status === 'ok') {
                                var token = res.data.info.access_token;
                                if (!token) {
                                    this.$message.warning(res.data.info);
                                    return;
                                }
                                localStorage.setItem('ms_username', this.ruleForm.username);
                                localStorage.setItem('token', tripledesUtil.encrypt(token));
                                api.getRoleAndAuth({
                                    "username": this.ruleForm.username
                                }).then((res) => {
                                    if (res.data.status === 'ok') {
                                        let authList = res.data.info.auth_list;
                                        let role = res.data.info.role;
                                        localStorage.setItem('auth', JSON.stringify(authList));
                                        localStorage.setItem('role', role.role_name);
                                        console.log("用户信息获取成功" + localStorage.getItem('role'));
                                        this.$router.push('/admin');
                                    } else {
                                        this.$message.warning(res.data.info);
                                    }
                                }).catch((err) => {
                                    console.log('获取权限和身份接口出错', res.data.errMsg);
                                });
                            } else {
                                console.log('获取token接口出错', res.data.err_msg);
                                this.$message.warning(res.data.err_msg);
                            }
                            this.isLoading = false;
                        }).catch((err) => {
                            console.error(err);
                            this.isLoading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            },
            refreshCode() {
                this.identifyCode = "";
                this.makeCode(this.identifyCodes, 4);
            },
            makeCode(o, l) {
                for (let i = 0; i < l; i++) {
                    this.identifyCode += this.identifyCodes[
                        this.randomNum(0, this.identifyCodes.length)
                        ];
                }
                console.log(this.identifyCode);
            }
        },
        mounted() {
            this.identifyCode = "";
            this.makeCode(this.identifyCodes, 4);
        },
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .ms-title {
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -230px;
        text-align: center;
        font-size: 30px;
        color: #fff;

    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 300px;
        height: 160px;
        margin: -150px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }

    .register-btn {
        width: 100%;
        margin-top: 5px;
        font-size: 14px;
        margin-left: 16rem;
        align-content: center;
    }
</style>
