/*加密和解密的方法*/
var CryptoJS = require("crypto-js");// 加载核心加密库
var tripledes = require("crypto-js/tripledes");// 加载des算法
const key = "UVDL1lO0B0Qc8A5S4D3F2G1H0J=";
export default{
  //加密方法
   encrypt: function(data){
     if(data == null){
        return ""
     }else{
        return tripledes.encrypt(data, key).toString()
     }
  },
  //解密方法
  decrypt: function(data){
    if(data == null){
       return ""
    }else{
       return tripledes.decrypt(data, key).toString(CryptoJS.enc.Utf8)
    }
  }
}
