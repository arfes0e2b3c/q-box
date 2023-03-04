<template>
  <ul>
    <h2>回答待ちの返信</h2>
    <p v-show="!posts[0]">質問はありません</p>
    <li v-for="post in posts" :key="post.id">
      <h3>{{ post.question }}</h3>
      <p>{{ post.answer }}</p>
      <div v-for="reply in post.replies" :key="reply.id">
        <div class="time-container">
          <p>{{ post.createdAt }}</p>
        </div>
        <div class="manage-send-sentence-box">
          <button @click="deletePost(reply.id)">削除</button>
          <h4>{{ reply.replySentence }}</h4>
          <button @click="showSendSentence(reply.id)" class="toggle-button">
            開閉
          </button>
        </div>
        <SharedAnswerSendSentence
          :ref="reply.id"
          :mode="modeReplyForReply"
          :contentId="reply.id"
          :replyTweetId="post.replyTweetId"
          :contentOriginId="post.id"
          :replySentence="reply.replySentence"
          :show="false"
          :requirementButton="false"
        />
      </div>
    </li>
  </ul>
</template>
<script>
import Common from "~/plugins/common.js";
export default {
  data() {
    return {
      replies: [],
      posts: [],
      modeReplyForReply: "replyForReply",
    };
  },
  methods: {
    showSendSentence(id) {
      this.$refs[id][0].toggle();
    },
    async fetchPostsHasReply() {
      let posts = await this.$axios.$get(
        "https://q-box.microcms.io/api/v1/q_box_posts?filters=replies[exists]",
        {
          headers: { "X-MICROCMS-API-KEY": this.$config.microCmsKey },
        }
      );
      posts = posts.contents.map((post) => {
        post.replies = Common.formatCreatedAt(post.replies);
        return post;
      });
      posts = this.filterReplyIsDeleted(posts);
    },
    filterReplyNotAnswered(posts) {
      for (let post of posts) {
        post.replies = post.replies.filter((reply) => {
          return !reply.replyAnswer;
        });
    filterReplyIsDeleted(posts) {
      posts.map((post) => {
        post.replies = post.replies.filter((reply) => {
          return !reply.isDeleted;
        });
        return post;
      });
      posts = this.filterHasNotAnswer(posts);
      return posts;
    },
        return post.replies.length;
      });
      return posts;
    },
    deletePost(id) {
      Common.deletePost(this, id, "q_box_replies", this.$config);
    },
  },
  mounted() {
    this.fetchPostsHasReply();
  },
};
</script>
<style scoped lang="scss">
header {
  width: 100%;
  height: 70px;
  border: 1px red solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
ul {
  width: 80%;
  margin: 0 auto;
  h2 {
    margin: 20px 0;
    font-size: 2.2em;
  }
  li {
    list-style: none;
    margin: 20px 0;
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
    overflow-wrap: break-word;
    h3 {
      white-space: pre-wrap;
      text-align: center;
      margin-bottom: 30px;
      color: red;
    }
    h3,
    p {
      width: 70%;
      text-align: center;
    }
    > div {
      width: 90%;
      display: flex;
      align-items: center;
      flex-direction: column;
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin: 10px 0;
      .time-container {
        width: 100%;
        display: flex;
        justify-content: center;
        p {
          width: auto;
          padding: 5px 10px;
          margin: 0;
          /* margin-bottom: 10px; */
          border-radius: 5px;
          border: 2px solid rgb(50, 50, 50);
          background-color: rgb(100, 100, 100);
          color: white;
          text-align: center;
          font-size: 14px;
        }
      }
      .manage-send-sentence-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
          &:hover {
            background-color: rgb(48, 48, 48);
            border: 1px solid rgba(255, 255, 255, 1);
          }
        }
        h4 {
          width: 70%;
          white-space: pre-wrap;
          text-align: center;
        }
      }
    }
  }
}
p {
  margin: 5px 0;
}
@media (max-width: 520px) {
  ul {
    width: 100%;
    h2 {
      font-size: 1.6em;
      margin-left: 10px;
    }
    li {
      padding: 20px 10px;
      margin: 10px 0;
      box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);
      h3 {
        width: 90%;
        margin-bottom: 10px;
      }
      p {
        width: 90%;
      }
      > div {
        margin: 5px 0;
        padding: 10px;
        box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);
        .manage-send-sentence-box {
          button {
            width: 50px;
            height: 70px;
          }
          h4 {
            max-width: calc(100% - 120px);
          }
        }
      }
    }
  }
}
</style>
