<template>
  <div id="app">
    <SharedHeader @searchPost="searchPost" />
    <div id="id-container" v-show="showIdContainer">
      <div class="card-container">
        <div class="primary-post">
          <p class="created-at" :class="post.state" v-html="post.createdAt"></p>
          <canvas :id="post.id"></canvas>
          <p v-html="post.answer" class="answer"></p>
        </div>
        <div
          v-for="reply in post.replies"
          :key="reply.id"
          class="secondary-post"
        >
          <canvas :id="reply.id"></canvas>
          <p v-html="reply.replyAnswer"></p>
        </div>
        <SharedSendSentence
          :mode="modeReply"
          :contentId="post.id"
          :show="true"
        />
        <!-- <SharedSendSentence
          class="send-sentence"
          :mode="modeQuestion"
          :show="true"
        /> -->
      </div>
      <SharedFooter />
    </div>
    <FilteredPost
      v-show="showFilteredPost"
      ref="FilteredPost"
      class="filtered-post"
    />
  </div>
</template>
<script>
import Common from "~/plugins/common.js";
import base64url from "base64url";
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
            "https://images.microcms-assets.io/assets/ca0c41f03efd472a910782fea07dff31/e8ff8e3ccffd4e89b37680d70a3b6d26/answered.png?w=1200&h=630&blend-mode=normal&blend-align=middle,center&blend=",
          keep: "https://images.microcms-assets.io/assets/ca0c41f03efd472a910782fea07dff31/6efb7cba640148a29d7b712679accffd/keep.png?w=1200&h=630&blend-mode=normal&blend-align=middle,center&blend=",
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
      showIdContainer: true,
      showFilteredPost: false,
    };
  },
  head() {
    this.payload = this.resp;
    // 相対パスを取得。例えば'/item/1'とか
    const path = this.$route.path;
    this.meta.description = this.item.explanation;
    this.meta.type = "article";
    this.meta.url = this.$config + path;
    this.meta.image =
      this.item.ImgixImageUrl[this.payload.state] +
      this.item.ImgixTextUrl +
      base64url(this.payload.question);
    this.meta.title = this.payload.question;

    // ここから先でmetaタグを書いていく
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
        { name: "twitter:title", content: "質問や過去の回答はこちらから" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  methods: {
    toHome() {
      this.showNewPost = true;
      this.showFilteredPost = false;
    },
    searchPost(word) {
      if (word) {
        this.$refs.FilteredPost.getPost(word);
        this.changeShowMode();
      }
    },
    changeShowMode() {
      this.showIdContainer = false;
      this.showFilteredPost = true;
    },
    async setReply() {
      if (this.post) {
        await this.$axios
          .$get(
            "https://q-box.microcms.io/api/v1/q_box_replies?filters=replyFor[equals]" +
              this.post.id +
              "[and]replyAnswer[exists]&orders=createdAt",
            {
              headers: { "X-MICROCMS-API-KEY": this.$config.microCmsKey },
            }
          )
          .then((response) => {
            Common.generateImage(
              document,
              response.contents,
              "replySentence",
              "",
              "answered"
            );
            this.$set(this.post, "replies", response.contents);
            Common.modifyUrlInPost(this.post.replies, "replyAnswer");
          })
          .catch((error) => {
            alert("通信に失敗しました。：" + error);
            console.log(error);
          });
      }
    },
    fillFixedText(ctx, text, imageWidth, imageHeight, canvas) {
      let column = [""];
      let line = 0;
      for (const char of text) {
        if (
          char.match(/\n/) ||
          ctx.measureText(column[line] + char).width > imageWidth * 0.75
        ) {
          line++;
          column[line] = "";
        }
        column[line] += char;
      }
      let lineHeight = ctx.measureText("あ").width * 1.8;
      if (line > 7) {
        canvas.height = (imageHeight + (line - 7) * lineHeight) / imageHeight;
      }
      for (var i = 0; i < column.length; i++) {
        ctx.fillText(
          "a",
          imageWidth / 2,
          imageHeight / 2 +
            lineHeight * i -
            (lineHeight * (column.length - 1)) / 2
        );
      }
    },
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
          this.post = response.contents.shift();
          this.post.createdAt = this.post.createdAt.substr(0, 10);
          Common.generateImage(document, [this.post], "question", "");
          this.setReply();
          Common.modifyUrlInPost([this.post], "answer");
        })
        .catch((error) => {
          alert("通信に失敗しました。：" + error);
          console.log(error);
        });
    },
  },
  async created() {
    this.getPosts();
  },
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "azuki";
  src: url("~@/assets/fonts/azuki.ttf") format("truetype");
}
* {
  font-family: azuki;
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
      }
      .primary-post {
        width: 80%;
        text-align: center;
        margin: 5px auto;
        .created-at {
          width: 100px;
          padding: 5px 10px;
          margin: 10px 10px;
          border: 2px solid rgba(67, 134, 135, 0.7);
          /* background-color: rgb(117, 184, 185); */
          color: white;
          border-radius: 5px;
        }
        .answered {
          background-color: rgb(0, 74, 169);
          border: 2px solid rgba(0, 24, 85, 0.7);
        }
        .keep,
        .waitInformation {
          background-color: rgb(255, 222, 103);
          border: 2px solid rgba(205, 172, 53, 0.7);
          color: #333;
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
        margin-top: 90px;
        width: 100%;
        padding: 20px 0;
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
}
</style>
