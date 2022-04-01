<template>
  <div id="app">
    <header>
      <nuxt-link to="/" class="nuxt-link">質問一覧</nuxt-link>
      <h1
        v-scroll-to="{
          element: '#app',
          offset: -200,
          duration: 500,
        }"
      >
        お手サーの質問箱
      </h1>
      <button @click="changePage">画面切り替え</button>
    </header>
    <AnswerWaitPost v-show="showPost" class="answer-wait-post" />
    <AnswerWaitReply v-show="showReply" class="answer-wait-reply" />
  </div>
</template>
<script>
import AnswerWaitPost from "~/components/AnswerWaitPost.vue";
import AnswerWaitReply from "~/components/AnswerWaitReply.vue";
export default {
  conponents: {
    AnswerWaitPost,
    AnswerWaitReply,
  },
  data() {
    return {
      showPost: true,
      showReply: false,
    };
  },
  methods: {
    changePage() {
      this.showPost = !this.showPost;
      this.showReply = !this.showReply;
    },
  },
};
</script>
<style lang="scss" scoped>
#app {
  header {
    width: 100%;
    height: 70px;
    background-color: white;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    h1 {
      cursor: pointer;
    }
    .nuxt-link {
      width: 20%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      text-decoration: none;
      transition: 0.5s;
      &:hover {
        background-color: rgba(48, 48, 48, 1);
        color: white;
      }
    }

    button {
      width: 20%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      text-decoration: none;
      transition: 0.5s;
      border: none;
      cursor: pointer;

      &:hover {
        background-color: rgba(48, 48, 48, 1);
        color: white;
      }
    }
  }
  .answer-wait-reply,
  .answer-wait-post {
    margin-top: 90px;
  }
}
@media (max-width: 520px) {
  #app {
    header {
      height: 60px;
      h1 {
        display: none;
      }
      .nuxt-link {
        width: 50%;
      }
      button {
        border-left: 1px solid rgb(48, 48, 48);
        width: 50%;
      }
    }
  }
}
</style>
