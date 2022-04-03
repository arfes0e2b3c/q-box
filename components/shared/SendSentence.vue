<template>
  <transition>
    <div
      v-show="getShow"
      class="sentence-box"
      :class="{ held: this.held, boxHeightInPosts: getMode === 'reply' }"
    >
      <h3 v-show="getMode === 'question'">お手伝いサークルに質問する</h3>
      <textarea
        :placeholder="this.textareaWord[mode]"
        v-model="sentence"
        autocomplete="off"
      ></textarea>
      <p v-show="getMode === 'answer' || getMode === 'replyForReply'">
        {{ this.sentence.length }}
      </p>
      <button @click="sendSentence()" class="button">
        {{ this.buttonWord[mode] }}
      </button>
    </div>
  </transition>
</template>
>
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
    held: false,
    show: "",
    MICROCMS_KEY: "",
    CONSUMER_KEY: "",
    CONSUMER_KEY_SECRET: "",
    ACCESS_TOKEN_KEY: "",
    ACCESS_TOKEN_KEY_SECRET: "",
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
        question: "お手伝いサークルへの質問を入力する",
        answer: "この質問への回答を入力する",
        reply: "この質問への返信を入力する",
        replyForReply: "この返信への回答を入力する",
      },
      buttonWord: {
        question: "質問する",
        answer: "回答する",
        reply: "返信する",
        replyForReply: "回答する",
      },
    };
  },
  methods: {
    toggle() {
      this.getShow = !this.getShow;
    },
    async sendSentence() {
      if (this.sentence && this.getMode === "question") {
        await this.$axios
          .$post(
            "https://q-box.microcms.io/api/v1/q_box_posts",
            {
              question: this.sentence,
              held: false,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-MICROCMS-API-KEY": this.MICROCMS_KEY,
              },
            }
          )
          .catch((error) => {
            alert("通信に失敗しました。：" + error);
            console.log(error);
          })
          .then(() => {
            this.sentence = "";
            alert("送信しました。");
          });
      } else if (this.sentence && this.getMode === "answer") {
        this.postTweet(this.sentence, this.getContentId, "tweet", "answer");
      } else if (this.sentence && this.getMode === "reply") {
        await this.$axios
          .$post(
            "https://q-box.microcms.io/api/v1/q_box_replies/",
            {
              replyFor: this.getContentId,
              replySentence: this.sentence,
              held: false,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-MICROCMS-API-KEY": this.MICROCMS_KEY,
              },
            }
          )
          .catch((error) => {
            alert("通信に失敗しました。：" + error);
            console.log(error);
          })
          .then(() => {
            this.sentence = "";
            // location.reload()
          });
      } else if (this.sentence && this.getMode === "replyForReply") {
        this.postTweet(
          "【フォロワーの方からの情報】\n\n" +
            this.getReplySentence +
            "\n\n" +
            this.sentence,
          this.getReplyTweetId,
          "reply",
          "replyForReply"
        );
        this.$emit("setReply");
      }
    },
    async postTweet(answer, id, mode, sendSentenceMode) {
      console.log("posttweet", answer, id);
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
          key: this.CONSUMER_KEY,
          secret: this.CONSUMER_KEY_SECRET,
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
        key: this.ACCESS_TOKEN_KEY,
        secret: this.ACCESS_TOKEN_KEY_SECRET,
      };
      const request = {
        url: "https://api.twitter.com/2/tweets",
        method: "POST",
      };
      let config = oauth.toHeader(
        oauth.authorize(request, token)
      ).Authorization;

      let data = {};
      const date = new Date();
      if (mode === "tweet") {
        data = {
          text:
            // slicedAnswer[0] + "\nhttps://unique-donut-e9d728.netlify.app/" + id,
            date,
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
      console.log(config);
      // await this.$axios.$get("/api/")
      await this.$axios
        .$post("https://api.twitter.com/api/2/tweets", data, {
          headers: {
            authorization: config,
          },
        })
        .then((response) => {
          if (slicedAnswer.length > 1) {
            this.postTweet(slicedAnswer.slice(1), response.data.id, "reply");
          }
          if (sendSentenceMode === "answer") {
            this.sendSentenceModeAnswer(response.data.id);
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
    async sendSentenceModeAnswer(id) {
      await this.$axios
        .$patch(
          "https://q-box.microcms.io/api/v1/q_box_posts/" + this.getContentId,
          {
            answer: this.sentence,
            replyTweetId: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-MICROCMS-API-KEY": this.MICROCMS_KEY,
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
          // location.reload()
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
              "X-MICROCMS-API-KEY": this.MICROCMS_KEY,
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
              "X-MICROCMS-API-KEY": this.MICROCMS_KEY,
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
  height: 150px;
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
  button {
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
.held {
  .button {
    color: white;
    border: 1px solid white;
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
      height: 150px;
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
        height: 150px;
      }
      &-active {
        transition: 0.5s;
      }
    }
    &-leave {
      opacity: 1;
      padding-top: 10px;
      height: 150px;
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
