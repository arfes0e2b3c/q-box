<template>
  <div id="app">
    <header>
      <nuxt-link to="/">質問箱を見に行く</nuxt-link>
      <h1
        v-scroll-to="{
          element: '#app',
          offset: -200,
          duration: 500,
        }"
      >
        質問箱(管理者版)
      </h1>
      <button @click="changeShowMode">画面切り替え</button>
    </header>
    <AnswerWaitPost v-show="showPost" class="answer-wait-post" />
    <AnswerWaitReply v-show="showReply" class="answer-wait-reply" />
    <AnswerKeepPost v-show="showKeep" class="answer-keep-post" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      showModeNumber: 0,
    };
  },
  computed: {
    showPost() {
      return this.showModeNumber % 3 === 0;
    },
    showReply() {
      return this.showModeNumber % 3 === 1;
    },
    showKeep() {
      return this.showModeNumber % 3 === 2;
    },
  },
  methods: {
    changeShowMode() {
      this.showModeNumber++;
    },
    toQBox() {
      const url = "https://q-box-otetsudai.an.r.appspot.com/";
      window.open(url, "_blank");
    },
  },
};
</script>
<style>
@font-face {
  font-family: "azuki";
  src: url("~@/assets/fonts/azuki.ttf") format("truetype");
}
* {
  font-family: azuki;
  margin: 0;
  padding: 0;
}
</style>
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
  .answer-wait-post,
  .answer-keep-post {
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
