<template>
    <div class="centers">
        <div class="c_left">
            <div class="cart-list-item">
                <div class="account-info-label">搜索</div>
                <!--<el-input v-model="searchWords" placeholder="输入标题,关键字,作者进行检索"></el-input>-->
                <el-autocomplete
                    class="search-key-input"
                    v-model="searchKeys"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
                    placeholder="输入标题,关键字,作者进行检索"
                >
                </el-autocomplete>
            </div>

            <div class="cart-list-item">
                <div class="account-info-label">分类</div>
                <ul>
                    <li v-for="(item,index) in blogCountByTypeList" @click="setTypeId(item.type_id)">
                        <a>{{item.type_name}}
                            <span>{{item.count}}</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="cart-list-item">
                <div class="account-info-label">归档</div>
                <ul>
                    <li v-for="(item,index) in blogCountByTimeList" @click="setBlogWithMonth(item.month)">
                        <a>{{item.month}}
                            <span>{{item.count}}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="c_right" v-loading="loading">
            <div class="sort_container">
                <span>排序:</span>
                <span class="btn" v-for="(item,index) in sortMsg" :class="{ isActive:isChange === index}"
                      @click="isChoose(index,item)">{{item.name}}</span>
            </div>
            <ul class="list-container" id="list-ul">
                <li v-for="(item,index) in blogList" @click="readCountUp(item.id,index)">
                    <router-link :to="{ name: 'article', query: {'articleId':item.id,'articleAuthor':item.author}}">
                        <p class="list-title">{{item.blog_title}}</p>
                        <p class="list-updated"><i class="iconfont icon-author"></i>{{item.author}}</p>
                        <p class="list-abstract"><i class="iconfont icon-37tag"></i>{{item.keywords}}</p>
                    </router-link>

                    <p class="list-keyWords">
                        <span style="cursor:pointer"><i class="iconfont icon-read"></i> {{item.read_count}} </span>&nbsp;&nbsp;
                        <span style="cursor:pointer"><i class="iconfont icon-reply"></i> {{item.reply_count}}</span>&nbsp;
                        <!--<span @click="thumup(item.id,index)" style="cursor:pointer">👍{{item.thumb_up}} </span>&nbsp;&nbsp;
                        <span @click="thumDown(item.id,index)" style="cursor:pointer">😔{{item.thumb_down}}</span>&nbsp;-->&nbsp;
                        {{dateFormat(item.created_at)}}
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
    </div>
</template>

<script type="text/babel">
    import * as api from '../../../api/front';
    import moment from "moment";

    export default {
        data() {
            return {
                currentPage: 1,
                pageSize: 8,
                totalNum: 100,
                blogList: [],
                blogCountByTypeList: [],
                blogCountByTimeList: [],
                blogTypeId: 0,
                searchWords: '',
                searchKeys: '',
                loading: false,
                sortType: 0, // 排序方式，0默认，1阅读量，2评论量
                sortMsg: [{name: '默认', id: 0},
                    {name: '按阅读量', id: 1},
                    {name: '按评论量', id: 2},
                ],
                isChange: 0,
            }
        },
        watch: {
            searchWords: function (newVal, oldVal) {
                this.tableIsLoading = true;
                this.getBlogList();
            }
        },
        methods: {
            thumup(blogID, index) {
                this.blogList[index].thumb_up += 1;
                console.log(blogID, index);
            },
            thumDown(blogID, index) {
                this.blogList[index].thumb_down += 1;
            },
            readCountUp(blogID, index) {
                this.blogList[index].read_count += 1;
                console.log(blogID, index);

            },
            setSortType(sort) {
                this.sortType = sort;
                this.getBlogList();
            },
            isChoose(index, item) {
                if (index !== this.isChange) {
                    this.isChange = index;
                    this.setSortType(index);
                }
            },
            setTypeId(type_id) {
                this.blogTypeId = type_id;
                this.getBlogList();
            },
            setBlogWithMonth(month) {
                this.searchWords = month;
            },
            //时间格式化  
            dateFormat: function (date) {
                return moment(date).format("YYYY-MM-DD HH:mm");
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
                    "blog_type_id": this.blogTypeId,
                    "search_words": this.searchWords,
                    "sort_type": this.sortType,
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
            //获取博客类别下博客数量
            getBlogTypeCount() {
                api.getBlogCountByType().then((res) => {
                    if (res.data.status === 'ok') {
                        this.blogCountByTypeList = res.data.info;
                    } else {
                        this.$message(res.data.errMsg)
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            //获取博客类别下博客数量
            getBlogPigeonholeCount() {
                api.getBlogPigeonholeCount().then((res) => {
                    if (res.data.status === 'ok') {
                        this.blogCountByTimeList = res.data.info;
                    } else {
                        this.$message(res.data.errMsg)
                    }
                }).catch((err) => {
                    console.error(err);
                })
            },
            handleSelect(item) {
                if (item.uuid === -1){
                    return;
                }
                this.searchWords = this.searchKeys;
            },
            querySearchAsync(queryString, callback) {
                if (this.searchKeys.length < 2) {
                    callback(null);
                    return;
                }
                let list = [{}];
                var params = {
                    "key": this.searchKeys,
                };
                //从后台获取到对象数组
                api.getKeySug(params).then((res) => {
                    if (res.data.status === 'ok') {
                        if (res.data.info == null) {
                            list.push({uuid: -1, value: "未搜索到结果"});
                            callback(list);
                            return
                        }
                        //在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
                        for (let i of res.data.info) {
                            list.push({value: i})
                        }
                        console.info(res.data.info);
                        callback(list);
                    } else {
                        console.error(res.data.err_msg);
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        },
        created() {
            this.searchWords = this.$route.query.tagName == null ? "" : this.$route.query.tagName;
            this.getBlogList();
            this.getBlogTypeCount();
            this.getBlogPigeonholeCount();
        }
    }
</script>

<style scoped>
    .btn {
        padding: 10px;
        width: 80px;
        background: #f5f5f5;
        border-radius: 5px;
        margin-left: 20px;
        cursor: pointer;
        border: 1px solid #CCCCCC;
    }

    .isActive {
        background: #8b8b8b;
    }

    .sort_container {
        width: 100%;
        margin: 10px auto;
        background: #f5f5f5;
        padding: 10px;
    }

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

    .centers {
        width: 100%;
        margin: 0 auto;
        clear: both;
    }

    .centers .c_left {
        float: left;
        width: 22%;
        margin-right: 3%;
    }

    .centers .c_right {
        float: left;
        width: 75%;
    }

    .account-info-label {
        width: 100%;
        padding: 5px 0;
        background: #F5F5F5;
    }

    .search-key-input {
        width: 100%;
    }

    .sidenav-drawer .sidenav-drawer-content {
        width: 240px;
        max-height: 100vh;
        overflow: auto;
    }

    @media (max-width: 720px) {
        .sidenav-drawer {
            position: relative;
            top: 10px;
        }
    }

    @media (max-width: 720px) {
        .sidenav-drawer .sidenav-drawer-content {
            max-height: none;
            box-sizing: border-box;
            background: none;
        }
    }

    .cart-list-item {
        margin: 10px;
        vertical-align: top;
    }

    .account-info-label {
        font-size: 14px !important;
        color: #333 !important;
        background: #f5f5f5;
        padding: 10px;
    }

    .cart-list-item p {
        margin: 0;
        padding: 10px;
        line-height: 16px;
        font-size: 12px;
        color: #666;
    }

    mat-grid-tile {
        color: #000;
        font-size: 12px;
    }

    .mat-grid-tile-sub {
        font-size: 14px;
        color: #333333;
    }

    .cart-list-item ul {
        margin: 0;
        list-style: none;
        padding: 0px 0px 10px;
        font-size: 13px;
    }

    .cart-list-item ul li {
        padding-left: 10px;
        padding-top: 10px;
        padding-right: 10px;
    }

    .cart-list-item ul li a {
        cursor: pointer;
        color: #c88326;
        text-decoration: none;
        display: flex;
        flex-direction: row;
    }

    .cart-list-item ul li span {
        flex: 1;
        text-align: right;
        color: #333;
    }

    .cart-list-item ul li a:hover {
        color: red;
    }

    .list-item-bottom {
        margin: 0 !important;
        padding: 0 !important;
        font-size: 11px;
        color: #b4b4b4;
    }
</style>
