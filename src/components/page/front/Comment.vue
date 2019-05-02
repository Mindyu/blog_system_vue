<template>
<div class="comment">
    <h1>评论</h1>
    <ul class="comments-list">
        <li class="comment-item" v-for="item in commentsList">
            <div class="comment-item-title">
                <p class="comment-item-name">{{item.commentUsername}}</p>
                <p class="comment-item-createdAt">{{item.commentTime}}</p>
            </div>

            <div v-for="reply in item.replyList" class="comment-reply-container">
                <div class="comment-item-title">
                    <p class="comment-item-name">{{reply.replyUsername}}</p>
                    <p class="comment-item-createdAt">{{reply.replyTime}}</p>
                </div>
                <p class="comment-item-content">{{reply.replyContent}}</p>
            </div>

            <p class="comment-item-content">{{item.commentContent}}</p>
            <div class="comment-item-reply-wrapper">
                <a @click="reply(item.commentID, item.commentUsername)" class="comment-item-reply">回复</a>
            </div>
        </li>
    </ul>
    <a name="firstAnchor"></a>
    <h1 id="comment-form-title">{{title}}{{replyName}}</h1>
    <div class="comment-form">
        <input v-model="formName" class="comment-form-name" type="text" placeholder="昵称" maxlength="20">
        <textarea v-model="formContent" class="comment-form-content" name="" id="" cols="30" rows="10" placeholder="内容"></textarea>
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
            replyName: '',
            articleId: 0,
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
            if (this.replyName == '') {
                //如果是评论
                const params = {
                    blogID: this.articleId,
                    blogTitle: this.blogTitle,
                    commentContent: this.formContent,
                    commentUsername: this.formName
                }
                api.addComment(params).then((res) => {
                    if (res.data.status == 'ok') {
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
                    commentID: this.formReply, //回复的评论ID
                    replyContent: this.formContent, //回复内容
                    replyUsername: this.formName, //回复的用户名
                }
                api.replyComment(params).then((res) => {
                    if (res.data.status == 'ok') {
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
        reply(replyToId, replyToName) {
            this.title = '回复';
            this.replyName = replyToName
            window.location.hash = ''
            window.location.hash = 'firstAnchor'
            this.formReply = replyToId
        },
        getComments() {
            var params = {
                'blogID': this.articleId,
                "currentPage": 1,
                "pageSize": 100
            };
            api.getCommentByBlogID(params).then((res) => {
                if (res.data.status) {
                    this.commentsList = res.data.info.list;
                    console.log(this.commentsList);
                } else {
                    console.log(res.data.info);
                    this.$message.info(res.data.info);
                }
            }).catch((err) => {
                console.error(err);
            })
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
