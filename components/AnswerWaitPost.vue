<template>
  <ul id="app">
    <div>
      <h2>回答待ちの質問：未回答{{ totalCount }}件</h2>
    </div>
    <p v-show="!posts[0]">質問はありません</p>
    <transition-group name="flip-list">
      <li class="card" v-for="post in posts" :key="post.id">
        <div class="time-container">
          <p>{{ post.createdAt }}</p>
        </div>
        <div class="box">
          <div>
            <button @click="deletePost(post.id)">削除</button>
          </div>
          <h3>{{ post.question }}</h3>
          <button @click="showSendSentence(post.id)" class="toggle-button">
            開閉
          </button>
        </div>
        <SharedAnswerSendSentence
          class="send-sentence"
          :mode="modeAnswer"
          :content-id="post.id"
          :ref="post.id"
          :show="false"
          :requirementButton="true"
          @get-posts="getPosts"
        />
      </li>
    </transition-group>
  </ul>
</template>
<script>
import Common from "~/plugins/common.js";
export default {
  data() {
    return {
      posts: [],
      totalCount: 0,
      modeAnswer: "answer",
    };
  },
  methods: {
    showSendSentence(id) {
      this.$refs[id][0].toggle();
    },
    async getPosts() {
      await this.$axios
        .$get(
          "https://q-box.microcms.io/api/v1/q_box_posts?filters=answer[not_exists]&orders=createdAt",
          {
            headers: { "X-MICROCMS-API-KEY": this.$config.microCmsKey },
          }
        )
        .then((response) => {
          const posts = Common.formatCreatedAt(response.contents);
          this.$set(this, "posts", posts);
          this.$set(this, "totalCount", response.totalCount);
        })
        .catch((error) => {
          alert("通信に失敗しました。：" + error);
          console.log(error);
        });
    },
    deletePost(id) {
      Common.deletePost(this, id, "q_box_posts", this.$config);
    },
  },
  async mounted() {
    this.getPosts();
  },
};
</script>
<style scoped lang="scss">
#app {
  width: 80%;
  margin: 0 auto;
  > div {
    display: flex;
    margin: 20px 0;
  }
  h2 {
    font-size: 2.2em;
  }
  .card {
    display: flex;
    align-items: center;
    flex-direction: column;
    list-style: none;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 20px 0;
    overflow-wrap: break-word;
    .box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 {
        width: 70%;
        text-align: center;
        white-space: pre-wrap;
      }
      div button,
      button {
        width: 100px;
        height: 30px;
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        background: none;
        transition: 0.5s;
        cursor: pointer;
        &:hover {
          background-color: #d77;
          border: 1px solid rgba(200, 0, 0, 1);
          color: white;
        }
      }
      .toggle-button {
        width: 100px;
        &:hover {
          background-color: rgb(48, 48, 48);
          border-color: rgb(48, 48, 48);
        }
      }
    }
    .time-container {
      width: 100%;
      display: flex;
      justify-content: center;
      p {
        /* width: 70px; */
        padding: 5px 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        border: 2px solid rgb(50, 50, 50);
        background-color: rgb(100, 100, 100);
        color: white;
        text-align: center;
        font-size: 14px;
      }
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
@media (max-width: 520px) {
  #app {
    width: 100%;
    div h2 {
      font-size: 1.6em;
      margin-left: 10px;
    }
    .card {
      padding: 10px;
      margin: 10px 0;
      box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);
      .box {
        h3 {
          width: auto;
          font-size: 1em;
          max-width: calc(100% - 120px);
        }
        div {
          width: 50px;
          button {
            width: 50px;
            height: 70px;
            margin: 5px 0;
          }
        }
        .toggle-button {
          width: 50px;
          height: 70px;
        }
      }
      .time-container {
        p {
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
