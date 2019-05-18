import axios from './interceptor';

let basePath = 'http://localhost:8081';


//*********************************博客前端请求***********************************************
//按搜索条件查找博客
export const getBlogList = params => {
    return axios.post(`${basePath}/front/blog/list`, params);
};
//获取博客类别下博客数量
export const getBlogCountByType = params => {
    return axios.get(`${basePath}/front/blog/typecount`, params);
};
//获取博客归档
export const getBlogPigeonholeCount = params => {
    return axios.get(`${basePath}/front/blog/monthcount`, params);
};
//获取博客标签
export const getTagList = params => {
    return axios.get(`${basePath}/front/blog/tags`, params);
};
//通过ID获取博客详情
export const getBlogByID = params => {
    return axios.get(`${basePath}/front/blog/query?blogId=` + params.blogID);
};

//获取某一篇博客的评论
export const getCommentByBlogID = params => {
    return axios.post(`${basePath}/front/comment/blogId`, params);
};
//为博客添加评论
export const addComment = params => {
    return axios.post(`${basePath}/front/comment/add`, params);
};
//回复评论
export const replyComment = params => {
    return axios.post(`${basePath}/front/reply/add`, params);
};
