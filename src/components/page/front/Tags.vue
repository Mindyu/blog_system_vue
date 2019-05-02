<template>
  <div>
    <div class="tagset">
      <ul>
        <li v-for="tag in tags">
          <a @click="update($index, tag.tagName, tag.objectId)"
             :class="{'tagset-active': $index === selected}">
            {{tag.tagName}}
          </a>
        </li>
      </ul>
    </div>
    <tag-content-list></tag-content-list>
  </div>
</template>

<script type="text/babel">
  export default {
    components: {
      TagContentList: function (resolve) {
        require(['./TagContentList'], resolve)
      }
    },
    data () {
      return {
        selected: 0,
        tags:[]
      }
    },
    created () {
      //this.getTags()
    },
    methods: {
      update (index, tagName, tagId) {
        this.selected = index
      //  this.getTagContentList(tagId)
      }
    }
  }
</script>

<style>
  .tagset {
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
</style>
