<template>
  <ul>
    <div>
      <h2>未回答の質問(古い順)</h2>
      <button @click="held">保留のみ表示</button>
    </div>
    <p v-show="!posts[0]">質問はありません</p>
    <transition-group name="flip-list">
      <li v-for="post in posts" :key="post.id" :class="{ held: post.held }">
        <div class="box">
          <div>
            <button @click="deletePost(post.id)">削除</button>
            <button @click="holdPost(post.id, post.held)">保留</button>
          </div>
          <h3>{{ post.question }}</h3>
          <button @click="showSendSentence(post.id)" class="toggle-button">
            開閉
          </button>
        </div>
        <SharedSendSentence
          class="send-sentence"
          :mode="modeAnswer"
          :content-id="post.id"
          :ref="post.id"
          :held="post.held"
          :show="false"
          :MICROCMS_KEY="MICROCMS_KEY"
          :CONSUMER_KEY="CONSUMER_KEY"
          :CONSUMER_KEY_SECRET="CONSUMER_KEY_SECRET"
          :ACCESS_TOKEN_KEY="ACCESS_TOKEN_KEY"
          :ACCESS_TOKEN_KEY_SECRET="ACCESS_TOKEN_KEY_SECRET"
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
      modeAnswer: "answer",
      heldOnly: false,
      MICROCMS_KEY: "",
      CONSUMER_KEY: "",
      CONSUMER_KEY_SECRET: "",
      ACCESS_TOKEN_KEY: "",
      ACCESS_TOKEN_KEY_SECRET: "",
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
            headers: { "X-MICROCMS-API-KEY": this.MICROCMS_KEY },
          }
        )
        .then((response) => {
          this.$set(this, "posts", response.contents);
        })
        .catch((error) => {
          alert("通信に失敗しました。：" + error);
          console.log(error);
        });
    },
    deletePost(id) {
      Common.deletePost(this, id, "q_box_posts", this.MICROCMS_KEY);
    },
    holdPost(id, held) {
      Common.holdPost(this, id, "q_box_posts", this.MICROCMS_KEY, held);
    },
    held() {
      if (!this.heldOnly) {
        this.posts.sort((first, second) => {
          return first.held === second.held ? 0 : first.held ? -1 : 1;
        });
      } else {
        this.posts.sort((first, second) => {
          return first.createdAt > second.createdAt ? 0 : -1;
        });
      }
      this.heldOnly = !this.heldOnly;
    },
  },
  async mounted() {
    this.MICROCMS_KEY = process.env.MICROCMS_KEY;
    this.CONSUMER_KEY = process.env.CONSUMER_KEY;
    this.CONSUMER_KEY_SECRET = process.env.CONSUMER_KEY_SECRET;
    this.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
    this.ACCESS_TOKEN_KEY_SECRET = process.env.ACCESS_TOKEN_KEY_SECRET;
    this.getPosts();
  },
};
</script>
<style scoped lang="scss">
header {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
ul {
  width: 80%;
  margin: 0 auto;
  > div {
    display: flex;
    margin: 10px 0;
  }
  h2 {
    font-size: 2.2em;
  }
  li {
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
        width: 50px;
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
  }
  .held {
    background-color: #333;
    color: white;
    .box div button {
      color: white;
      border: 1px solid rgba(255, 255, 255, 1);
    }
    div .toggle-button {
      color: white;
      border: 1px solid rgba(255, 255, 255, 1);
      &:hover {
        background-color: rgb(255, 255, 255);
        border: 1px solid rgba(255, 255, 255, 1);
        color: rgb(48, 48, 48);
      }
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
@media (max-width: 520px) {
  ul {
    width: 100%;
    div h2 {
      font-size: 1.6em;
      margin-left: 10px;
    }
    li {
      padding: 10px;
      margin: 10px 0;
      .box {
        h3 {
          width: auto;
          font-size: 1em;
          max-width: calc(100% - 120px);
        }
        div {
          width: 50px;
          button {
            margin: 5px 0;
          }
        }
        .toggle-button {
          width: 50px;
          height: 70px;
        }
      }
    }
  }
}
</style>
