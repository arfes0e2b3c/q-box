<template>
  <transition>
    <div
      v-show="getShow"
      class="sentence-box"
      :class="{ boxHeightInPosts: getMode === 'reply' }"
    >
      <h3 v-show="getMode === 'question'">質問する</h3>
      <textarea
        :placeholder="this.textareaWord[mode]"
        v-model="sentence"
        autocomplete="off"
      ></textarea>
      <p v-show="getMode === 'answer' || getMode === 'replyForReply'">
        {{ this.sentence.length }}
      </p>
      <div class="button-container">
        <button @click="sendSentence('answered')" class="button">
          {{ this.buttonWord[getMode] }}
        </button>
        <button
          @click="sendSentence('keep')"
          class="button"
          v-show="keepButton"
        >
          保留
        </button>
      </div>
    </div>
  </transition>
</template>
<script>
import OAuth from "oauth-1.0a";
import crypto from "crypto";
export default {
  props: {
    mode: "",
    contentId: "",
    replyTweetId: "",
    contentOriginId: "",
    replySentence: "",
    show: "",
    keepButton: false,
  },
  data() {
    return {
      getShow: this.show,
      getMode: this.mode,
      getContentId: this.contentId,
      getReplyTweetId: this.replyTweetId,
      getContentOriginId: this.contentOriginId,
      getReplySentence: this.replySentence,
      sentence: "",
      textareaWord: {
        question: "質問を入力する",
        answer: "この質問への回答を入力する",
        reply: "この質問への返信を入力する",
        replyForReply: "この返信への回答を入力する",
        answerForKeep:
          "保留中の質問に対する最終回答を入力する(現在の回答は書き換えられます。)",
      },
      buttonWord: {
        question: "質問する",
        answer: "回答する",
        reply: "返信する",
        replyForReply: "回答する",
        answerForKeep: "回答する",
      },
    };
  },
  methods: {
    toggle() {
      this.getShow = !this.getShow;
    },
    async sendSentence(state) {
      if (this.sentence) {
        if (this.getMode === "answer" || this.getMode === "answerForKeep") {
          this.postTweet(
            this.sentence,
            this.getContentId,
            "tweet",
            "answer",
            state
          );
        } else if (this.getMode === "replyForReply") {
          this.postTweet(
            "【フォロワーの方からの情報】\n\n" +
              this.getReplySentence +
              "\n\n" +
              "【お手サーから】\n" +
              this.sentence,
            this.getReplyTweetId,
            "reply",
            "replyForReply"
          );
          this.$emit("setReply");
        }
      }
    },
    async postTweet(answer, id, mode, sendSentenceMode, state) {
      const TWEET_LIMIT_CHARS_INCLUDE_URL = 110;
      const TWEET_LIMIT_CHARS = 140;
      let slicedAnswer = [...answer];
      if (!Array.isArray(answer)) {
        slicedAnswer = [];
        slicedAnswer.push(answer.slice(0, TWEET_LIMIT_CHARS_INCLUDE_URL));
        for (
          let i = TWEET_LIMIT_CHARS_INCLUDE_URL;
          i < answer.length - 2;
          i += TWEET_LIMIT_CHARS
        ) {
          slicedAnswer.push(answer.slice(i, i + TWEET_LIMIT_CHARS));
        }
      }
      const oauth = OAuth({
        consumer: {
          key: this.$config.consumerKey,
          secret: this.$config.consumerKeySecret,
        },
        signature_method: "HMAC-SHA1",
        hash_function(base_string, key) {
          return crypto
            .createHmac("sha1", key)
            .update(base_string)
            .digest("base64");
        },
      });
      const token = {
        key: this.$config.accessTokenKey,
        secret: this.$config.accessTokenKeySecret,
      };
      const request = {
        url: "https://api.twitter.com/2/tweets",
        method: "POST",
      };
      let config = oauth.toHeader(
        oauth.authorize(request, token)
      ).Authorization;

      slicedAnswer[0] =
        slicedAnswer.length > 1 ? slicedAnswer[0] + " (続く)" : slicedAnswer[0];
      let data = {};
      if (mode === "tweet") {
        data = {
          // TODO: replace domain
          text:
            slicedAnswer[0] +
            "\n#お手伝いサークル\n" +
            this.$config.baseUrl +
            id,
        };
      } else if (mode === "reply") {
        data = {
          text: slicedAnswer[0],
          reply: {
            in_reply_to_tweet_id: id,
          },
        };
      } else {
        console.log("not fit!");
      }
      await this.$axios
        .$post("/api/2/tweets", data, {
          headers: {
            authorization: config,
          },
        })
        .then((response) => {
          if (slicedAnswer.length > 1) {
            this.postTweet(slicedAnswer.slice(1), response.data.id, "reply");
          }
          if (sendSentenceMode === "answer") {
            this.sendSentenceModeAnswer(response.data.id, state);
          } else if (sendSentenceMode === "replyForReply") {
            this.sendSentenceModeReplyForReply(response.data.id);
            this.setReplyTweetId(response.data.id);
          }
        })
        .catch((error) => {
          alert("通信に失敗しました。：" + error);
          console.log(error);
        });
    },
    async sendSentenceModeAnswer(id, state) {
      await this.$axios
        .$patch(
          "https://q-box.microcms.io/api/v1/q_box_posts/" + this.getContentId,
          {
            answer: this.sentence,
            replyTweetId: id,
            state: state,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-MICROCMS-API-KEY": this.$config.microCmsKey,
            },
          }
        )
        .catch((error) => {
          alert("通信に失敗しました。：" + error);
          console.log(error);
        })
        .then(() => {
          this.$emit("get-posts");
          this.sentence = "";
        });
    },
    async sendSentenceModeReplyForReply() {
      await this.$axios
        .$patch(
          "https://q-box.microcms.io/api/v1/q_box_replies/" + this.getContentId,
          {
            replyAnswer: this.sentence,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-MICROCMS-API-KEY": this.$config.microCmsKey,
            },
          }
        )
        .then(() => {
          this.$emit("set-replies");
          this.sentence = "";
        })
        .catch((error) => {
          alert("通信に失敗しました。：" + error);
          console.log(error);
        });
    },
    async setReplyTweetId(id) {
      await this.$axios
        .$patch(
          "https://q-box.microcms.io/api/v1/q_box_posts/" +
            this.getContentOriginId,
          {
            replyTweetId: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-MICROCMS-API-KEY": this.$config.microCmsKey,
            },
          }
        )
        .catch((error) => {
          alert("通信に失敗しました。：" + error);
          console.log(error);
        });
    },
  },
};
</script>
<style scoped lang="scss">
.sentence-box {
  width: calc(100% - 40px);
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.5s;
  padding-top: 20px;
  overflow: hidden;
  h3 {
    margin: 10px auto;
  }
  textarea {
    resize: none;
    width: calc(80% - 40px);
    height: 30px;
    padding: 20px;
    outline: none;
    border-color: rgba(0, 0, 0, 0.15);
    border-width: 2px;
    border-radius: 10px;
  }
  .button-container {
    display: flex;
    button {
      margin: 0 5px;
      width: 80px;
      height: 30px;
      margin-top: 10px;
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      background: none;
      transition: 0.5s;
      cursor: pointer;
      &:hover {
        background-color: #77d;
        border: 1px solid rgba(0, 0, 200, 1);
        color: white;
      }
    }
  }
}
.boxHeightInPosts {
  height: 114px;
}
.v {
  &-enter {
    opacity: 0;
    height: 0;
    padding-top: 0;
    &-to {
      opacity: 1;
      height: 120px;
      padding-top: 20px;
    }
    &-active {
      transition: 0.5s;
    }
  }
  &-leave {
    opacity: 1;
    padding-top: 20px;
    &-to {
      opacity: 0;
      height: 0;
      padding-top: 0;
    }
    &-active {
      transition: 0.5s;
    }
  }
}
@media (max-width: 520px) {
  .sentence-box {
    width: 100%;
    padding-top: 10px;
    h3 {
      font-size: 1em;
    }
    textarea {
      width: calc(90% - 40px);
      padding: 10px;
    }
  }
  .boxHeightInPosts {
    height: 94px;
  }
  .v {
    &-enter {
      opacity: 0;
      height: 0;
      padding-top: 0;
      &-to {
        opacity: 1;
        padding-top: 10px;
        height: 120px;
      }
      &-active {
        transition: 0.5s;
      }
    }
    &-leave {
      opacity: 1;
      padding-top: 10px;
      height: 120px;
      &-to {
        opacity: 0;
        height: 0;
        padding-top: 0;
      }
      &-active {
        transition: opacity 0.1s, padding-top 0.5s, height 0.5s;
      }
    }
  }
}
</style>
