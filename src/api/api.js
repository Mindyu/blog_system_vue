import axios from './interceptor';
import Qs from 'qs'

let basePath = 'http://localhost:8081';

//获取token
export const getToken = params => {
    return axios.post(`${basePath}/user/login`, Qs.stringify(params));
};


/********************************用户管理************************************************/
//获取用户列表
export const getUserList = params => {
    return axios.post(`${basePath}/user/all`, params);
};
//获取所有身份(admin/normal)
export const getUserType = params => {
    return axios.get(`${basePath}/user/type`, params);
};
//获取某个用户详细信息(通过用户名)
export const getUserInfo = params => {
    return axios.get(`${basePath}/user/query?username=` + params.username);
};
//获取用户的权限和身份信息
export const getRoleAndAuth = params => {
    return axios.get(`${basePath}/user/auth?username=` + params.username);
}
//添加用户
export const addUser = params => {
    return axios.post(`${basePath}/user/add`, params);
};
//验证用户名是否已注册
export const validUsername = params => {
    return axios.get(`${basePath}/user/valid/${params.username}`);
};
//通过用户名删除某个用户
export const delUserByID = params => {
    return axios.delete(`${basePath}/user/delete?userId=` + params.userID);
};
//编辑用户信息
export const editUserInfo = params => {
    return axios.put(`${basePath}/user/edit`, params);
};


//*********************************博客管理***********************************************
//按搜索条件查找博客
export const getBlogList = params => {
    return axios.post(`${basePath}/blog/list`, params);
};
//获取博客所有类别
export const getBlogType = params => {
    return axios.get(`${basePath}/blog/type`, params);
};
//获取博客类别下博客数量
export const getBlogCountByType = params => {
    return axios.get(`${basePath}/blog/typecount`, params);
};
//获取博客归档
export const getBlogPigeonholeCount = params => {
    return axios.get(`${basePath}/blog/monthcount`, params);
};
//获取博客标签
export const getTagList = params => {
    return axios.get(`${basePath}/blog/tags`, params);
};
//通过ID获取博客详情
export const getBlogByID = params => {
    return axios.get(`${basePath}/blog/query?blogId=` + params.blogID);
};
//更新博客
export const editBlogInfo = params => {
    return axios.put(`${basePath}/blog/update`, params);
};
//添加博客
export const addBlog = params => {
    return axios.post(`${basePath}/blog/add`, params);
};
//通过ID删除博客
export const delBlogByID = params => {
    return axios.delete(`${basePath}/blog/delete?blogId=` + params.blogID);
};


//*******************************评论/回复管理***************************************************
//获取评论列表
export const getCommentList = params => {
    return axios.post(`${basePath}/comment/list`, params);
};
//获取某一篇博客的评论
export const getCommentByBlogID = params => {
    return axios.post(`${basePath}/comment/blogId`, params);
};
//删除评论
export const delCommentByID = params => {
    return axios.delete(`${basePath}/comment/delete?commentId=` + params.commentID);
};
//批量删除评论
export const delCommentList = params => {
    return axios.delete(`${basePath}/comment/batchDelete?commentIds=` + params.commentIdList);
};
//为博客添加评论
export const addComment = params => {
    return axios.post(`${basePath}/comment/add`, params);
};
//回复评论
export const replyComment = params => {
    return axios.post(`${basePath}/reply/add`, params);
};
//获取恢复列表
export const getCommentReplyList = params => {
    return axios.post(`${basePath}/reply/list`, params);
};
//删除回复
export const delCommentReplyByID = params => {
    return axios.delete(`${basePath}/reply/delete?replyId=` + params.replyID);
};
//批量删除回复
export const delCommentReplyList = params => {
    return axios.delete(`${basePath}/reply/batchDelete?replyIds=` + params.replyIdList);
};

//********************************好友管理*************************************************
//获取好友列表
export const getFriendList = params => {
    return axios.post(`${basePath}/friend/list`, params);
};
//删除好友
export const delFriend = params => {
    return axios.delete(`${basePath}/friend/delete`, params);
};
//新增好友
export const addFriend = params => {
    return axios.post(`${basePath}/friend/add`, params);
};

//********************************关注管理*************************************************
//获取关注列表
export const getAttentionList = params => {
    return axios.post(`${basePath}/attention/list`, params);
};
//删除关注
export const delAttention = params => {
    return axios.delete(`${basePath}/attention/delete`, params);
};
//新增关注
export const addAttention = params => {
    return axios.post(`${basePath}/attention/add`, params);
};


//********************************私信管理*************************************************
//获取未读私信
export const getNotReadMsg = params => {
    return axios.get(`${basePath}/msg/unread?name=` + params.username);
};
//获取已读私信
export const getReadMsg = params => {
    return axios.get(`${basePath}/msg/read?name=` + params.username);
};
//设置私信已阅
export const setMsgRead = params => {
    return axios.put(`${basePath}/msg/read?id=` + params.id);
};
//新增或者回复私信
export const addPrivateMsg = params => {
    return axios.post(`${basePath}/msg/add`, params);
};

//********************************系统日志***************************************************
//获取系统日志列表（支持多种条件查询）
export const getSystemLogList = params => {
    return axios.post(`${basePath}/system/list`, params);
};
//删除系统日志
export const delSystemLog = params => {
    return axios.delete(`${basePath}/system/delete?logId=` + params.logId);
};
//系统日志量
export const getSystemLogCount = params => {
    return axios.get(`${basePath}/system/count`, params);
};
//系统访问量
export const getSystemAccessCount = params => {
    return axios.get(`${basePath}/system/access`, params);
};

//*******************************文件上传 ***************************************************
export const uploadURL = `${basePath}/file/`;
