import axios from './interceptor';
import Qs from 'qs'

let basePath = 'http://localhost:8081';

//获取token
export const getToken = params => { return axios.post(`${basePath}/user/login`, Qs.stringify(params)); };


/********************************用户管理************************************************/
//获取用户列表
export const getUserList = params => { return axios.post(`${basePath}/user/all`, params); };
//获取所有身份(admin/normal)
export const getUserType = params => { return axios.get(`${basePath}/user/type`, params); };
//获取某个用户详细信息(通过用户名)
export const getUserInfo = params => { return axios.post(`${basePath}/user/query`, params); };
//获取用户的权限和身份信息
export const getRoleAndAuth = params =>{ return axios.get(`${basePath}/user/auth?username=`+params.username);}
//添加用户
export const addUser = params => { return axios.post(`${basePath}/user/add`, params); };
//验证用户名是否已注册
export const validUsername = params => { return axios.get(`${basePath}/user/valid/${params.username}`); };
//通过用户名删除某个用户
export const delUserByID = params => { return axios.delete(`${basePath}/user/delete?userID=`+params.userID); };
//编辑用户信息
export const editUserInfo = params => { return axios.put(`${basePath}/user/edit`, params); };


//*********************************博客管理***********************************************
//按搜索条件查找博客
export const getBlogList = params => { return axios.post(`${basePath}/blog/list`, params); };
//获取博客所有类别
export const getBlogType = params => { return axios.get(`${basePath}/blogType/list`, params); };
//通过ID获取博客详情
export const getBlogByID = params => { return axios.get(`${basePath}/blog/id?blogId=`+params.blogID); };
//更新博客
export const editBlogInfo = params => { return axios.post(`${basePath}/blog/update`, params); };
//添加博客
export const addBlog = params => { return axios.post(`${basePath}/blog/add`, params); };
//通过ID删除博客
export const delBlogByID = params => { return axios.get(`${basePath}/blog/delete?blogID=`+params.blogID); };


//*******************************评论/回复管理***************************************************
//获取评论列表
export const getCommentList =  params => { return axios.post(`${basePath}/comment/query`, params); };
//获取某一篇博客的评论
export const getCommentByBlogID = params => { return axios.post(`${basePath}/comment/blogID`, params); };
//删除评论
export const delCommentByID = params => { return axios.post(`${basePath}/comment/delete`, params); };
//批量删除评论
export const delCommentList = params => { return axios.post(`${basePath}/comment/batchDelete`, params); };
//为博客添加评论
export const addComment = params => { return axios.post(`${basePath}/comment/add`, params); };
//回复评论
export const replyComment = params => { return axios.post(`${basePath}/comment/reply`, params); };


//********************************好友管理*************************************************
//获取好友列表
export const getFriendList =  params => { return axios.post(`${basePath}/friend/list`, params); };
//删除好友
export const delFriend = params => { return axios.post(`${basePath}/friend/delete`, params); };


//********************************系统日志***************************************************
//获取系统日志列表（支持多种条件查询）
export const getSystemLogList = params => { return axios.post(`${basePath}/system/logList`, params); };
//删除系统日志
export const delSystemLog = params => { return axios.post(`${basePath}/system/deleteLog`, params); };
//批量删除日志

//*******************************文件上传 ***************************************************
export const uploadURL = `${basePath}/file/upload/avatar`;
