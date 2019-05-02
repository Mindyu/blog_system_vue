<template>
    <div class="list-wrapper" v-loading="loading">
        <ul class="list-container" id="list-ul">
            <li v-for="(item,index) in blogList">
                <router-link :to="{ name: 'article', query: {'articleId':item.id}}">
                    <p class="list-title">{{item.blog_title}}</p>
                    <p class="list-updated">{{item.author}}</p>
                    <p class="list-abstract" v-for="item in (item.keywords||'').split(',') ">
                        <el-tag type="success">{{item}}</el-tag>
                    </p>
                </router-link>
                <p class="list-keyWords">
                    <span @click="thumup(item.id,index)" style="cursor:pointer">👍{{item.thumb_up}} </span>&nbsp&nbsp
                    <span @click="thumDown(item.id,index)" style="cursor:pointer">😔{{item.thumb_down}}</span>&nbsp&nbsp
                    {{dateFormat(item.updated_at)}}
                </p>
            </li>
        </ul>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange"
                           :current-page.sync="currentPage"
                           :page-size="pageSize"
                           layout="prev, pager, next, jumper"
                           :total="totalNum">
            </el-pagination>
        </div>
    </div>
</template>

<script type="text/babel">
    import api from '@/api';
    import moment from "moment";

    export default {
        data() {
            return {
                currentPage: 1,
                pageSize: 5,
                totalNum: 100,
                blogList: [],
                loading: false,
            }
        },
        methods: {
            thumup(blogID, index) {
                this.blogList[index].thumb_up += 1;
                console.log(blogID, index);
            },
            thumDown(blogID, index) {
                this.blogList[index].thumb_down += 1;
                console.log(blogID, index);
            },
            //时间格式化  
            dateFormat: function (date) {
                return moment(date).format("YYYY-MM-DD");
            },
            // 分页处理事件
            handleCurrentChange(val) {
                this.tableIsLoading = true;
                this.currentPage = val;
                this.getBlogList();
            },
            //获取博客列表
            getBlogList() {
                this.loading = true;
                var params = {
                    "current_page": this.currentPage,
                    "page_size": this.pageSize,
                    "blog_type_id": 0,
                    "search_words": ''
                };
                api.getBlogList(params).then((res) => {
                    if (res.data.status === 'ok') {
                        this.totalNum = res.data.info.totalNum;
                        this.blogList = res.data.info.list;
                        this.loading = false;
                    } else {
                        this.$message(res.data.errMsg);
                        console.log(res.data.errMsg);
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
        },
        created() {
            this.getBlogList();
        }
    }
</script>

<style scoped>
    .list-container li {
        border-bottom: 1px solid #eee;
    }

    .list-title {
        font-size: 2.6rem;
        font-weight: 400;
        color: #404040;
        margin-top: 0;
    }

    .list-abstract {
        font-size: 1.6rem;
        color: #919191;
        font-weight: 300;
        display: inline;
        margin-right: 1rem;
    }

    .list-keyWords {
        font-size: 1.6rem;
        color: #919191;
        font-weight: 300;
        display: inline;
        display: flex;
        justify-content: flex-end;
    }

    .list-updated {
        font-family: "Comic Sans MS", curslve, sans-serif;
        font-size: 1.8rem;
        color: #8b8b8b;
        padding: 5px 0;
    }

    .list-container li a {
        padding: 1rem 1.5rem;
        display: block;
        transition: all .3s;
        margin: 0;
    }

    .list-container li a:hover {
        background-color: Rgba(0, 0, 0, .02);
    }

    @media screen and (max-width: 768px) {
        .list-title {
            font-size: 2.2rem;
        }

        .list-updated {
            font-size: 1.6rem;
        }
    }
</style>
