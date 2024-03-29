<template>
  <div class="app">
    <SharedSendSentence
      class="send-sentence"
      :mode="modeQuestion"
      :show="true"
    />
    <ul>
      <h2>最新の質問</h2>
      <p v-show="!posts[0]">質問はありません</p>
      <li v-for="post in posts" :key="post.id">
        <div class="primary-post">
          <p class="created-at" :class="post.state" v-html="post.createdAt"></p>
          <div @click="transition(post.id)" class="card-button">
            <canvas :id="post.id"></canvas>
          </div>
          <p v-html="post.answer" class="answer"></p>
        </div>
        <div
          v-for="reply in post.replies"
          :key="reply.id"
          class="secondary-post"
        >
          <canvas :id="reply.id"></canvas>
        </div>
      </li>
    </ul>
    <no-ssr>
      <infinite-loading @infinite="loadNewPost">
        <div slot="spinner" class="spinner">読み込んでいます...</div>
        <div slot="no-more" class="no-more">条件に合致した質問は以上です。</div>
        <div slot="no-results" class="no-results">
          条件に合致した質問は見つかりませんでした。
        </div>
        <div slot="error" class="no-results">エラーが発生しました。</div>
      </infinite-loading>
    </no-ssr>
  </div>
</template>
<script>
import Common from "~/plugins/common.js";
import InfiniteLoading from "vue-infinite-loading";
export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      posts: [],
      modeQuestion: "question",
      modeReply: "reply",
      postCount: 0,
      totalCount: 0,
    };
  },
  methods: {
    transition(id) {
      this.$router.push({ path: id });
    },
    async loadNewPost($state) {
      const loadPostNumber = 20;
      const response = await this.$axios
        .$get(
          "https://q-box.microcms.io/api/v1/q_box_posts?filters=answer[exists][and]replyTweetId[exists]&limit=" +
            loadPostNumber +
            "&offset=" +
            this.postCount,
          {
            headers: { "X-MICROCMS-API-KEY": this.$config.microCmsKey },
          }
        )
        .catch((error) => {
          $state.error();
          alert("通信に失敗しました。：" + error);
          console.log(error);
        });
      if (this.postCount < response.totalCount) {
        this.totalCount = response.totalCount;
        this.postCount += response.contents.length;

        let posts = response.contents;

        Common.modifyUrlInPost(posts, "answer");
        posts = this.posts.concat(posts);
        posts = this.filterPostAnswered(posts);
        Common.generateImage(document, posts, "question");
        this.posts = Common.formatCreatedAt(posts);

        this.setReply();

        $state.loaded();
      } else {
        $state.complete();
      }
    },
    filterPostAnswered(posts) {
      for (let post of posts) {
        post.replies = post.replies.filter((reply) => {
          return reply.replyAnswer;
        });
      }
      return posts;
    },
    setReply() {
      if (this.posts) {
        for (const post of this.posts) {
          Common.generateImage(
            document,
            post.replies,
            "replySentence",
            "answered"
          );
          Common.modifyUrlInPost(post.replies, "replyAnswer");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.send-sentence {
  margin: 0 auto;
  width: 60%;
  transition: 0s;
}
h2 {
  margin: 30px 0;
  font-size: 2.2em;
}
ul {
  width: 60%;
  margin: 0 auto;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    padding: 5%;
    padding-top: 2%;
    padding-bottom: 1%;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
    canvas {
      width: 100%;
      border-radius: 10px;
      box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
    }
    p {
      white-space: pre-line;
      overflow-wrap: break-word;
    }
    .primary-post {
      width: 80%;
      text-align: center;
      margin: 0 auto;
      .card-button {
        transition: 0.5s;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
      .answer {
        width: 80%;
        margin: 10px auto;
      }
      .created-at {
        width: 100px;
        padding: 5px 10px;
        margin: 10px;
        border-radius: 5px;
        color: white;
      }
      .answered {
        background-color: rgb(0, 74, 169);
        border: 2px solid rgba(0, 24, 85, 0.7);
      }
      .requirement,
      .waitInformation {
        background-color: rgb(255, 222, 103);
        border: 2px solid rgba(205, 172, 53, 0.7);
        color: #666;
      }
    }
    .secondary-post {
      width: 60%;
      text-align: center;
      margin: 5px auto;
      p {
        width: 80%;
        margin: 10px auto;
      }
    }
  }
}
.spinner {
  animation: spinner 1s infinite ease;
}
@keyframes spinner {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.no-more,
.no-results,
.spinner {
  margin: 30px auto;
}

@media (max-width: 1024px) {
  ul {
    width: 100%;
  }
}
@media (max-width: 520px) {
  .send-sentence {
    width: 100%;
    margin: 0 !important;
  }
  ul {
    width: 100%;
    h2 {
      font-size: 1.6em;
      margin: 10px;
    }
    li {
      width: 100%;
      padding: 0px 0;
      margin-bottom: 15px;
      box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);
      .primary-post {
        width: 95%;
      }
      .secondary-post {
        width: 75%;
      }
    }
  }
}
</style>
