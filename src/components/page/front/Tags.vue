<template>
    <div class="tagset">
        <div class="tag-cloud">
            <a v-for="(item,index) in tagList">
                <router-link :to="{ name: 'index', query: {'tagName':item.tag_name}}">
                    {{item.tag_name}}
                </router-link>
            </a>
        </div>
    </div>
</template>

<script type="text/babel">
    import api from '@/api';

    export default {
        data() {
            return {
                tagList: [],
            }
        },
        methods: {
            update(index, tagName, tagId) {
                this.selected = index
            },
            getTags() {
                api.getTagList().then((res) => {
                    if (res.data.status === 'ok') {
                        this.tagList = res.data.info;
                        console.info(this.tagList)
                    } else {
                        this.$message(res.data.errMsg);
                        console.log(res.data.errMsg);
                    }
                }).catch((err) => {
                    console.error(err);
                })
            }
        },
        created() {
            this.getTags()
        },
    }
</script>

<style>
    .tagset {
        width: 80%;
        max-width: 100rem;
        margin: 2rem auto;
    }

    .tagset ul {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
    }

    .tagset li {
        margin: .3rem;
    }

    .tagset li a {
        display: block;
        cursor: pointer;
        padding: .3rem 1.6rem;
        margin: 0;
        border: 1px solid #d2d2d2;
        border-radius: .5rem;
        color: rgba(0, 0, 0, .8);
        background-color: #f7f7f7;
        transition: all .4s;
    }

    .tagset li a:hover, .tagset .tagset-active {
        background-color: #555555;
        color: #fff;
    }

    @media screen and (max-width: 768px) {
        .tagset li a {
            padding: .1rem 1rem;
        }

        .tagset li {
            margin: .2rem;
        }
    }

    .tag-cloud {
        margin: 2rem auto;
        text-align: center;
    }

    .tag-cloud a {
        display: inline-block;
        margin: 10px;
        color: #c0ccda;
    }

    .tag-cloud a:hover {
        color: #222 !important;
    }
</style>
