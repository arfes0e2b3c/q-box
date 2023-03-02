<template>
  <div id="app">
    <SharedHeader />
    <div class="main-wrapper">
      <SharedSendSentence
        :mode="modeQuestion"
        id="send-sentence"
        :show="true"
      />
      <ul>
        <h2>「 {{ this.title }} 」の検索結果</h2>
        <p v-show="!posts">合致する質問は見つかりませんでした。</p>
        <li v-for="post in posts" :key="post.id">
          <div class="primary-post">
            <p
              class="created-at"
              :class="post.state"
              v-html="
                post.createdAt.substr(5, 2) + '/' + post.createdAt.substr(8, 2)
              "
            ></p>
            <div @click="transition(post.id)" class="card-button">
              <canvas :id="post.id"></canvas>
            </div>
            <p v-html="post.answer"></p>
          </div>
          <div
            v-for="reply in post.replies"
            :key="reply.id"
            class="secondary-post"
          >
            <canvas :id="reply.id"></canvas>
            <!-- <p v-html="reply.replyAnswer">{{ reply.replyAnswer }}</p> -->
          </div>
          <SharedSendSentence
            :mode="modeReply"
            :contentId="post.id"
            :show="true"
          />
        </li>
      </ul>
      <no-ssr>
        <infinite-loading @infinite="loadNewPost">
          <div slot="spinner" class="spinner">読み込んでいます...</div>
          <div slot="no-more" class="no-more">
            条件に合致した質問は以上です。
          </div>
          <div slot="no-results" class="no-results">
            条件に合致した質問は見つかりませんでした。
          </div>
          <div slot="error" class="no-results">エラーが発生しました。</div>
        </infinite-loading>
      </no-ssr>
      <div
        class="chevron-up"
        v-scroll-to="{
          element: '#app',
          offset: -200,
          duration: 500,
        }"
      >
        <fa :icon="faChevronUp" />
      </div>
    </div>
    <SharedFooter />
  </div>
</template>

<script>
import Common from "~/plugins/common.js";
import InfiniteLoading from "vue-infinite-loading";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
export default {
  layout: "default",
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      faChevronUp,
      keyword: "",
      posts: [],
      modeQuestion: "question",
      modeReply: "reply",
      canvas: null,
      ctx: null,
      image: null,
      postCount: 5,
      state: null,
      title: "",
    };
  },
  // head() {
  //   this.meta.description = "お手伝いサークル";
  //   this.meta.type = "article";
  //   this.meta.url = this.$config.baseUrl;
  //   this.meta.image =
  //     "https://images.microcms-assets.io/assets/ca0c41f03efd472a910782fea07dff31/c9428b14ddd44f5485c2fc8ce7c2c61d/answered.png?w=1200&h=630&blend-mode=normal&blend-align=middle,center&blend=https%3A%2F%2Fassets.imgix.net%2F~text%3Fw%3D1000%26txt-color%3D333%26txt-align%3Dcenter%26txt-size%3D36%26txtfont%3DHiragino%20Sans%20W6%26txt=お手伝いサークル公式サイト";
  //   this.meta.title = "お手伝いサークル";

  //   return {
  //     title: this.meta.title,
  //     meta: [
  //       {
  //         hid: "description",
  //         name: "description",
  //         content: this.meta.description,
  //       },
  //       {
  //         hid: "og:description",
  //         property: "og:description",
  //         content: this.meta.description,
  //       },
  //       { hid: "og:title", property: "og:title", content: this.meta.title },
  //       { hid: "og:type", property: "og:type", content: this.meta.type },
  //       { hid: "og:url", property: "og:url", content: this.meta.url },
  //       { hid: "og:image", property: "og:image", content: this.meta.image },
  //       { name: "twitter:title", content: "質問や過去の回答はこちらから" },
  //       { name: "twitter:card", content: "summary_large_image" },
  //     ],
  //   };
  // },
  methods: {
    transition(id) {
      this.$router.push({ path: id });
    },
    async loadNewPost($state) {
      this.state = $state;
      const loadPostNumber = 10;
      await this.$axios
        .$get(
          "https://q-box.microcms.io/api/v1/q_box_posts?filters=answer[exists][and]question[contains]" +
            this.keyword +
            "&limit=" +
            loadPostNumber +
            "&offset=" +
            this.postCount,
          {
            headers: { "X-MICROCMS-API-KEY": this.$config.microCmsKey },
          }
        )
        .then((response) => {
          if (this.postCount < response.totalCount) {
            Common.modifyUrlInPost(response.contents, "answer");
            this.posts = this.posts.concat(response.contents);
            Common.generateImage(document, response.contents, "question");
            this.setReply();
            this.postCount += response.contents.length;
            $state.loaded();
          } else if (this.postCount >= response.totalCount) {
            this.postCount = 1;
            $state.complete();
          }
        })
        .catch((error) => {
          $state.error();
          alert("通信に失敗しました。：" + error);
          console.log(error);
        });
    },
    async getPost(word) {
      this.keyword = word;
      if (this.state) {
        this.state.reset();
      }
      this.setTitle(word);
      await this.$axios
        .$get(
          "https://q-box.microcms.io/api/v1/q_box_posts?filters=answer[exists][and](question[contains]" +
            word +
            "[or]answer[contains]" +
            word +
            ")&limit=10",
          {
            headers: { "X-MICROCMS-API-KEY": this.$config.microCmsKey },
          }
        )
        .then((response) => {
          this.posts = response.contents;
          this.posts = this.filterPostAnswered(this.posts);
          Common.generateImage(document, response.contents, "question");
          this.setReply();
          Common.modifyUrlInPost(this.posts, "answer");
        });
    },
    filterPostAnswered(posts) {
      for (let post of posts) {
        post.replies = post.replies.filter((reply) => {
          return reply.replyAnswer;
        });
      }
      return posts;
    },
    setTitle(word) {
      this.title = word;
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
  mounted() {
    this.keyword = this.$route.query.keyword;
    this.getPost(this.keyword);
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
<style scoped lang="scss">
.main-wrapper {
  min-height: calc(100vh - 241px);
}
.chevron-up {
  display: none;
}
ul {
  width: 80%;
  margin: 0 auto;
  // min-height: 100vh;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 0;
    padding: 5% 10%;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
    overflow-wrap: break-word;
    .primary-post {
      width: 80%;
      text-align: center;
      margin: 5px auto;
      .created-at {
        width: 100px;
        padding: 5px 10px;
        margin: 10px;
        border: 2px solid rgba(67, 134, 135, 0.7);
        background-color: rgb(117, 184, 185);
        color: white;
        border-radius: 5px;
      }
      .answered {
        background-color: rgb(0, 74, 169);
        border: 2px solid rgba(0, 24, 85, 0.7);
      }
      .requirement,
      .waitInformation {
        background-color: rgb(255, 222, 103);
        border: 2px solid rgba(205, 172, 53, 0.7);
      }
      .answer {
        width: 80%;
        margin: 10px auto;
      }
      .card-button {
        transition: 0.5s;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
    }
    canvas {
      width: 100%;
      border-radius: 10px;
      div {
        width: 90%;
        text-align: center;
        margin: 5px auto;
      }
    }
    p {
      margin: 20px 0;
    }
    .secondary-post {
      width: 60%;
      text-align: center;
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
@media (max-width: 520px) {
  .chevron-up {
    position: fixed;
    bottom: 40px;
    right: 30px;
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid white;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 2.2em;
  }
  .send-sentence {
    width: 100%;
  }
  ul {
    width: 100%;
    h2 {
      font-size: 1.6em;
      margin: 20px 10px 10px;
    }
    li {
      width: 100%;
      padding: 20px 0;
      .primary-post {
        width: 90%;
      }
      .secondary-post {
        width: 75%;
      }
    }
  }
}
</style>
