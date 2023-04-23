<template>
  <transition>
    <div
      v-show="show"
      class="sentence-box"
      :class="{ boxHeightInPosts: mode === 'reply' }"
    >
      <h3 v-show="mode === 'question'">お手伝いサークルに質問する</h3>
      <textarea
        :placeholder="this.textareaWord[mode]"
        v-model="sentence"
        autocomplete="off"
      ></textarea>
      <p v-if="mode === 'question'" class="question-message">
        正確な回答のため、学部と学年の併記をお願いします！
      </p>
      <p v-show="mode === 'answer' || mode === 'replyForReply'">
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
    mode: String,
    contentId: String,
    replyTweetId: String,
    contentOriginId: String,
    replySentence: String,
    replyIds: Array,
    show: Boolean,
  },
  data() {
    return {
      sentence: "",
      textareaWord: {
        question: "質問を入力する",
        answer: "この質問への回答を入力する",
        reply: "この質問に関する情報提供を頂けますと幸いです！",
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
      this.show = !this.show;
    },
    async sendSentence() {
      if (this.sentence && this.mode === "question") {
        await this.$axios
          .$post(
            "https://q-box.microcms.io/api/v1/q_box_posts",
            {
              question: this.sentence,
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
            this.sentence = "";
            alert("質問を送信しました。内容を確認の上返答させて頂きます！");
          });
      } else if (this.sentence && this.mode === "reply") {
        const replyRes = await this.$axios
          .$post(
            "https://q-box.microcms.io/api/v1/q_box_replies/",
            {
              replyFor: this.contentId,
              replySentence: this.sentence,
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
        const latestReply = await this.$axios.$get(
          "https://q-box.microcms.io/api/v1/q_box_replies/" + replyRes.id,
          {
            headers: {
              "Content-Type": "application/json",
              "X-MICROCMS-API-KEY": this.$config.microCmsKey,
            },
          }
        );
        const replyIdObjects = latestReply.replyFor.replies;
        const replyIds = replyIdObjects.map((object) => {
          return object.id;
        });
        await this.$axios.$patch(
          "https://q-box.microcms.io/api/v1/q_box_posts/" + this.contentId,
          {
            replies: [...replyIds, replyRes.id],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-MICROCMS-API-KEY": this.$config.microCmsKey,
            },
          }
        );
        alert("返信を送信しました。ご協力いただきありがとうございます！");
        this.$router.go({ path: this.$router.currentRoute.path, force: true });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.sentence-box {
  width: calc(100% - 40px);
  /* height: 150px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.5s;
  padding-top: 20px;
  overflow: hidden;
  padding-bottom: 10px;
  h3 {
    margin: 10px auto;
    font-size: 18px;
  }
  textarea {
    resize: none;
    width: calc(80% - 40px);
    height: 30px;
    padding: 20px;
    outline: none;
    border: none;
    border-bottom: 2px solid #333;
    border-color: rgba(0, 0, 0, 0.15);
    border-width: 2px;
    transition: 0.2s;
    border-radius: 0;
    &:focus {
      border-color: rgba(0, 0, 0, 0.5);
    }
  }
  .question-message {
    margin-top: 10px;
    font-weight: bold;
  }
  button {
    width: 100px;
    height: 40px;
    margin-top: 20px;
    background-color: #333;
    color: white;
    font-weight: bold;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 1px;
    transition: 0.3s;
    cursor: pointer;
    &:hover {
      background-color: white;
      color: #333;
      /* border: 1px solid #333; */
      border: 1px solid transparent;
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
    }
  }
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
      font-size: 20px;
    }
    textarea {
      width: calc(90% - 40px);
      padding: 20px 10px;
    }
    .question-message {
      font-size: 14px;
    }
  }
  .boxHeightInPosts {
    height: 130px;
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
