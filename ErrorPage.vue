<template>
  <div class="errorBox">
    <div>
      <div class="wrongTilte">Something's wrong here...</div>
      <div class="wrongMsg">We can't find the page you're looking for. Check out our Help Center or head back to home.</div>
      <div><el-button @click="isVisible = true">Help</el-button>&nbsp &nbsp<el-button @click="backHome">Home</el-button></div>
    </div>
    <el-dialog title="建议/反馈" :visible.sync="isVisible" center modal custom-class="dialog">
      <el-form status-icon :model="error" :rules="rules" ref="errorForm" onsubmit="return false">
        <el-form-item prop="errorMsg">
          <el-col :span="19" :offset="2">
            <el-input type="textarea" v-model="error.errorMsg" :rows="10" placeholder="请详细描述你遇到的问题，我们会第一时间解决"/>
          </el-col>
        </el-form-item>
        <el-form-item prop="contact" :inline-message="true">
          <el-col :span="19" :offset="2">
            <el-input  v-model="error.contact" placeholder="请留下你的Outlook邮箱，格式:zhangsan@ruijie.com.cn"/>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel('errorForm')">取 消</el-button>
        <el-button type="primary" @click="submitError('errorForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api';
export default {
  name: 'error',
  data(){
    var validContact = (rule, value, callback) =>{
      if(value == '') return callback(new Error(' '));
      if(value.indexOf('@ruijie.com.cn') >= 1){ //邮箱前缀最短为1
        callback();
      }else{
        return callback(new Error('邮箱输入有误'));
      }
    };
    return{
      isVisible:false,
      error:{
        errorMsg:'',
        contact:'',
      },
      rules:{
        errorMsg:[{
          required: true,
          message: ' ',
          trigger: 'blur'
        }],
        contact:[{
           validator: validContact,
           trigger: 'blur'
         }] ,
      }
    }
  },
  methods:{
    cancel(formName){
      this.isVisible = false;
      this.$refs[formName].clearValidate();
    },
    backHome(){
      this.$router.push("/home");
    },
    submitError(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //发邮件
          api.sendMail({
            From:"资质管理系统",
            To:'[zhangsan@ruijie.com.cn]',//数组
            CC:'',
            Bcc:"密送",
            Subject:"资质管理系统反馈",
            Body:"",
            Label:"",
            Name:"名称",
            LinkURL:"",
            Fromname:"资质管理系统通知",
            Br:"二进制流",
            Attachment:"",
          }).then((res) => {
            this.$message({
              message: '您的反馈已经提交成功，感谢您的配合',
              type: 'success'
            });
          }).catch((err) => {
            this.$message({message: '邮件发送失败'});
            console.log(err);
          });
          this.isVisible = false;
          this.error.errorMsg = '';
          this.error.contact = '';
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style>
  .errorBox{
    margin: 60px auto;
    width:70%;
    height:80vh;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    padding: 70px 25px;
    border: 1px solid #eaeaea;
    box-shadow: 5px 5px 15px #cac6c6;
    background: #344A5F;
    color: #FFFFFF;
  }
  .dialog{
    background-color:#FFFFFF;
  }
  .wrongTilte{
    font-size: 28px;
    margin-top: 50px;
    margin-bottom: 10px;

  }
  .wrongMsg{
    font-size: 16px;
    margin-bottom:68px;
  }
</style>
