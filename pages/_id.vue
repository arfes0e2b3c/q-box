<template>
  <div id="app">
    <SharedHeader />
    <div id="id-container">
      <div class="card-container">
        <div class="primary-post">
          <p
            class="created-at"
            :class="post.state"
            v-html="post.createdAt"
            v-if="post.state != 'old'"
          ></p>
          <p
            class="created-at"
            :class="post.state"
            v-html="'過去の質問'"
            　v-if="post.state == 'old'"
          ></p>
          <canvas :id="post.id"></canvas>
          <p v-html="post.answer" class="answer"></p>
        </div>
        <div
          v-for="reply in post.replies"
          :key="reply.id"
          class="secondary-post"
        >
          <canvas :id="reply.id"></canvas>
          <!-- <p v-html="reply.replyAnswer"></p> -->
        </div>
        <SharedSendSentence
          :mode="modeReply"
          :contentId="post.id"
          :replyIds="replyIds"
          :show="true"
          v-if="post.state !== 'old'"
        />
      </div>
      <SharedSendSentence
        class="send-sentence"
        :mode="modeQuestion"
        :show="true"
      />
      <SharedFooter />
    </div>
  </div>
</template>
<script>
import Common from "~/plugins/common.js";
import base64url from "base64url";
import Vue from "vue";
export default {
  async asyncData({ route, $axios, $config }) {
    const id = route.path.slice(1);
    const resp = await $axios.get(
      "https://q-box.microcms.io/api/v1/q_box_posts/" +
        id +
        "?fields=question,id,state&answer[exists]",
      {
        headers: { "X-MICROCMS-API-KEY": $config.microCmsKey },
      }
    );
    return { resp: resp.data };
  },
  data() {
    return {
      payload: { question: "", id: "" },
      imgixId: "",
      item: {
        name: "質問はこちらから。",
        ImgixTextUrl:
          "https%3A%2F%2Fassets.imgix.net%2F~text%3Fw%3D1000%26txt-color%3D333%26txt-align%3Dcenter%26txt-size%3D36%26txtfont%3DHiragino%20Sans%20W6%26txt64%3D",
        ImgixImageUrl: {
          answered:
            "https://images.microcms-assets.io/assets/ca0c41f03efd472a910782fea07dff31/c9428b14ddd44f5485c2fc8ce7c2c61d/answered.png?w=1200&h=630&blend-mode=normal&blend-align=middle,center&blend=",
          requirement:
            "https://images.microcms-assets.io/assets/ca0c41f03efd472a910782fea07dff31/f3e07d2865ab43a8a173e70d23d20638/requirement.png?w=1200&h=630&blend-mode=normal&blend-align=middle,center&blend=",
        },
        explanation: "お手伝いサークル公式サイト",
      },
      meta: {
        title: "",
        description: "",
        type: "",
        url: "",
        image: "",
      },
      post: [],
      modeQuestion: "question",
      modeReply: "reply",
      originReplies: {},
    };
  },
  head() {
    this.payload = this.resp;
    const path = this.$route.path;
    this.meta.description = this.item.explanation;
    this.meta.type = "article";
    this.meta.url = this.$config + path;
    this.meta.image =
      this.item.ImgixImageUrl[this.payload.state] +
      this.item.ImgixTextUrl +
      base64url(this.payload.question);
    this.meta.title = this.payload.question;

    return {
      title: this.meta.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.meta.description,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.meta.description,
        },
        { hid: "og:title", property: "og:title", content: this.meta.title },
        { hid: "og:type", property: "og:type", content: this.meta.type },
        { hid: "og:url", property: "og:url", content: this.meta.url },
        { hid: "og:image", property: "og:image", content: this.meta.image },
        { name: "twitter:title", content: "質問や情報提供はこちらから" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  methods: {
    async getPosts() {
      await this.$axios
        .$get(
          "https://q-box.microcms.io/api/v1/q_box_posts?filters=id[equals]" +
            this.$route.path.slice(1),
          {
            headers: { "X-MICROCMS-API-KEY": this.$config.microCmsKey },
          }
        )
        .then((response) => {
          let post = response.contents.shift();
          this.originReplies = Object.values(Vue.util.extend({}, post.replies));
          [post] = Common.formatCreatedAt([post]);
          post = this.filterPostAnswered([post])[0];
          Common.generateImage(document, [post], "question");
          this.setReply(post);
          Common.modifyUrlInPost([post], "answer");
          this.post = post;
        })
        .catch((error) => {
          alert("通信に失敗しました。：" + error);
          console.log(error);
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
    async setReply(post) {
      if (post) {
        Common.generateImage(
          document,
          post.replies,
          "replySentence",
          "answered"
        );
        Common.modifyUrlInPost(post.replies, "replyAnswer");
      }
    },
  },
  computed: {
    replyIds() {
      if (this.originReplies.length) {
        return this.originReplies.map((reply) => {
          return reply.id;
        });
      } else {
        return [];
      }
    },
  },
  async created() {
    this.getPosts();
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
#id-container {
  .card-container {
    width: 60%;
    margin: 120px auto 50px;
    overflow-wrap: break-word;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
    padding: 5%;
    canvas {
      width: 100%;
      border-radius: 10px;
      box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
    }
    .primary-post {
      width: 80%;
      text-align: center;
      margin: 5px auto;
      .created-at {
        width: 100px;
        padding: 5px 10px;
        margin: 10px 10px;
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
        color: #333;
      }
      .old {
        background-color: rgb(255, 141, 198);
        border: 2px solid rgba(205, 91, 148, 0.7);
      }
      .answer {
        width: 80%;
        margin: 10px auto;
      }
    }
    .secondary-post {
      width: 60%;
      text-align: center;
      margin: 5px auto;
    }
    p {
      white-space: pre-line;
      margin: 10px auto;
      text-align: center;
    }
  }
}
.send-sentence {
  margin: 0 auto 30px;
  width: 60%;
  transition: 0s;
}
.v {
  &-enter {
    opacity: 0;
    transform: scale(90%);
    &-to {
      opacity: 1;
      transform: scale(100%);
    }
    &-active {
      transition: 0.2s;
    }
  }
  &-leave {
    opacity: 1;
    transform: scale(100%);
    &-to {
      opacity: 0;
      transform: scale(90%);
    }
    &-active {
      transition: 0.2s;
    }
  }
}
@media (max-width: 520px) {
  #id-container {
    .card-container {
      width: 100%;
      width: 100%;
      padding: 20px 0;
      margin-top: 0;
      .primary-post {
        width: 95%;
      }
      .secondary-post {
        width: 75%;
      }
    }
  }
}
.send-sentence {
  margin: 0 auto 30px;
  width: 100%;
  transition: 0s;
}
</style>
