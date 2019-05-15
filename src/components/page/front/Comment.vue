<template>
    <div class="comment">
        <div v-if="commentsList.length>0">
            <h1>评论</h1>
        </div>
        <div v-else>
            <center>
                <span>还没有评论，你愿意做第一个评论的人嘛？</span>
            </center>
        </div>
        <ul class="comments-list">
            <li class="comment-item" v-for="item in commentsList">
                <div class="comment-item-title">
                    <p class="comment-item-name">{{item.comment_username}}</p>
                    <p class="comment-item-createdAt">{{item.created_at}}</p>
                </div>

                <p class="comment-item-content">{{item.comment_content}}</p>
                <div class="comment-item-reply-wrapper">
                    <a @click="reply(item.id, item.comment_username, 0, item.id)" class="comment-item-reply">回复</a>
                </div>

                <div v-for="reply_item in item.comment_reply" class="comment-reply-container">
                    <div class="comment-item-title">
                        <p class="comment-item-name">{{formatName(reply_item.from_username,
                            reply_item.to_username)}}</p>
                        <p class="comment-item-createdAt">{{reply_item.created_at}}</p>
                    </div>
                    <p class="comment-item-content">{{reply_item.reply_content}}</p>
                    <div class="comment-item-reply-wrapper">
                        <a @click="reply(reply_item.id, reply_item.from_username, 1, item.id)"
                           class="comment-item-reply">回复</a>
                    </div>
                </div>
            </li>
        </ul>
        <a name="firstAnchor"></a>
        <h1 id="comment-form-title">{{title}}{{replyName}}</h1>
        <div class="comment-form">
            <input v-model="formName" class="comment-form-name" type="text" placeholder="昵称" maxlength="20">
            <textarea v-model="formContent" class="comment-form-content" name="" id="" cols="30" rows="10"
                      placeholder="内容"></textarea>
            <div class="comment-item-reply-wrapper">
                <a @click="submit" class="comment-item-reply comment-item-reply-submit">提交</a>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    import api from '@/api';

    export default {
        props: {
            blogTitle: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                formName: '',
                formContent: '',
                formReply: '',
                replyType: 0,
                replyName: '',
                articleId: 0,
                commentId: 0,
                commentsList: [],
                title: '评论'
            }
        },
        methods: {
            //回复or评论
            submit() {
                if (!this.formName.trim() || !this.formContent.trim()) {
                    this.$message.warning('昵称和内容不可为空');
                    return
                }
                if (this.replyName === '') {
                    //如果是评论
                    const params = {
                        "blog_id": this.articleId,
                        "blog_title": this.blogTitle,
                        "comment_content": this.formContent,
                        "comment_username": this.formName
                    }
                    api.addComment(params).then((res) => {
                        if (res.data.status === 'ok') {
                            this.$message.success('评论成功');
                            this.getComments();
                        } else {
                            this.$message.info(res.data.errMsg);
                            console.log(res.data.errMsg);
                        }
                    }).catch((err) => {
                        console.error('添加评论出错', err);
                    })

                } else {
                    //如果是回复
                    const params = {
                        "comment_id": this.commentId,   //回复的评论
                        "reply_id": this.formReply,     //回复的评论ID
                        "reply_type": this.replyType,   //0：回复评论or1：回复回复
                        "reply_content": this.formContent,  //回复内容
                        "from_username": this.formName,     //回复的用户名
                        "to_username": this.replyName,      //回复的用户名
                    }
                    console.info(params)
                    api.replyComment(params).then((res) => {
                        if (res.data.status === 'ok') {
                            this.$message.success('回复成功');
                            this.getComments();
                        } else {
                            this.$message.info(res.data.errMsg);
                        }
                    }).catch((err) => {
                        console.error('回复评论出错', err);
                    });
                }
                this.title = '评论';
                this.formName = ''
                this.formContent = ''
                this.replyName = ''
                this.formReply = ''
            },
            reply(replyToId, replyToName, replyType, commentId) {
                this.title = '回复';
                this.replyName = replyToName
                this.replyType = replyType
                this.commentId = commentId
                window.location.hash = ''
                window.location.hash = 'firstAnchor'
                this.formReply = replyToId
            },
            getComments() {
                var params = {
                    'blog_id': parseInt(this.articleId),
                    "search_words": '',
                    "current_page": 1,
                    "page_size": 100
                };
                api.getCommentByBlogID(params).then((res) => {
                    if (res.data.status === "ok") {
                        this.commentsList = res.data.info.list;
                        console.log(this.commentsList);
                    } else {
                        console.log(res.data.info);
                        this.$message.info(res.data.info);
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            formatName(from_username, to_username) {
                return from_username + "@" + to_username;
            }
        },
        created() {
            this.articleId = this.$route.query.articleId;
            this.getComments();
        },
    }
</script>

<style>
    .comment h1 {
        border-bottom: 1px dashed #d2d2d2;
        margin: 1rem;
    }

    .comment-item {
        display: flex;
        flex-flow: column wrap;
        justify-items: center;
    }

    .comment-item-title {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        background-color: #f7f7f7;
        padding: .5rem 1rem;
        border-radius: .5rem;
    }

    .comment-item-name {
        font-weight: bold;
    }

    .comment-item-content {
        padding: 1rem;
    }

    .comment-item-reply-wrapper {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
    }

    .comment-item-reply {
        padding: 1rem;
        transition: all .4s;

    }

    .comment-item-reply:hover {
        color: #838383;
        cursor: pointer;
    }

    .comment-reply-container {
        /*background-color: rgba(0, 0, 0, .1);*/
        border: 1px solid #d2d2d2;
        border-radius: .5rem;
        margin: 1rem;
        color: #7c7c7c;
    }

    .comment-reply-container .comment-item-title {
        background-color: #fbfbfb;
    }

    .comment-form {
        display: flex;
        flex-flow: column nowrap;
        padding: 1rem;
    }

    .comment-form-name,
    .comment-form-content {
        border: 1px solid #d2d2d2;
        margin-bottom: 1rem;
        padding: 1rem;
        font-size: 1.6rem;
        border-radius: .5rem;
    }

    .comment-form-name {
        height: 3.6rem;
    }

    .comment-form-content {
        resize: none;
    }

    .comment-item-reply-submit {
        border: 1px solid #d2d2d2;
        border-radius: .5rem;
    }
</style>
