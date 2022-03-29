<template>
  <ul>
    <h2>未回答の返信</h2>
    <p v-show="!posts[0]">質問はありません</p>
    <li v-for="post in posts" :key="post.id">
      <h3>{{ post.question }}</h3>
      <p>{{ post.answer }}</p>
      <div v-for="reply in post.replies" :key="reply.id" :class="{held: reply.held}">
        <div class="manage-send-sentence-box">
          <div>
            <button @click="deletePost(reply.id)">削除</button>
            <button @click="holdPost(reply.id, reply.held)">保留</button>
          </div>
          <h4>{{ reply.replySentence }}</h4>
          <button @click="showSendSentence(reply.id)" class="toggle-button">開閉</button>
        </div>
        <SendSentence 
          :ref="reply.id" 
          :mode="modeReplyForReply" 
          :contentId="reply.id" 
          :replyTweetId="post.replyTweetId" 
          :contentOriginId="post.id" 
          :replySentence="reply.replySentence" 
          :show="false"
          :MICROCMS_KEY="MICROCMS_KEY"
          :CONSUMER_KEY="CONSUMER_KEY"
          :CONSUMER_KEY_SECRET="CONSUMER_KEY_SECRET"
          :ACCESS_TOKEN_KEY="ACCESS_TOKEN_KEY"
          :ACCESS_TOKEN_KEY_SECRET="ACCESS_TOKEN_KEY_SECRET"
          @set-replies="setReply"
        />
      </div>
    </li>
  </ul>
</template>
<script>
import Common from '~/plugins/common.js'
import SendSentence from '~/components/shared/SendSentence.vue'
export default{
  components:{
    SendSentence
  },
  data(){
    return{
      MICROCMS_KEY: '',
      CONSUMER_KEY: '',
      CONSUMER_KEY_SECRET: '',
      ACCESS_TOKEN_KEY: '',
      ACCESS_TOKEN_KEY_SECRET: '',
      replies: [],
      posts:[],
      modeReplyForReply: 'replyForReply'
    }
  },
  methods:{
    showSendSentence(id) {
      this.$refs[id][0].toggle()
    },
    async setReply() {
      await this.$axios.$get('https://q-box.microcms.io/api/v1/q_box_replies?filters=replyAnswer[not_exists]&orders=createdAt',{
        headers: { 'X-MICROCMS-API-KEY': this.MICROCMS_KEY}
      }).then((response) => {
        const idList = this.makeIdList(response.contents)
        this.$set(this, 'replies', response.contents)
        this.getPost(idList)
      }).catch((error) => {
        alert('通信に失敗しました。：' + error)
        console.log(error)
      })
    },
    makeIdList(replies) {
      let idList = []
      for(const reply of replies) {
        idList.push(reply.replyFor)
      }
      return idList.filter(function (x, i, self) {
          return self.indexOf(x) === i;
      });
    },
    async getPost(idList) {
      let postList = []
      for(const id of idList) {
        await this.$axios.$get('https://q-box.microcms.io/api/v1/q_box_posts?filters=id[equals]' + id, {
          headers: { 'X-MICROCMS-API-KEY': this.MICROCMS_KEY}
        }).then((response) => {
          response.contents[0].replies = this.replies.filter((x) => {
            if(x.replyFor === response.contents[0].id){
              return x
            }
          })
          postList.push(response.contents[0])
        }).catch((error) => {
          alert('通信に失敗しました。：' + error)
          console.log(error)
        })
      }
      this.$set(this, 'posts', postList)
    },
    deletePost(id) {
      Common.deletePost(this, id, 'q_box_replies', this.MICROCMS_KEY)
    },
    holdPost(id, held) {
      Common.holdPost(this, id, 'q_box_replies', this.MICROCMS_KEY, held)
    }
  },
  mounted(){
    this.MICROCMS_KEY = process.env.MICROCMS_KEY
    this.CONSUMER_KEY = process.env.CONSUMER_KEY
    this.CONSUMER_KEY_SECRET = process.env.CONSUMER_KEY_SECRET
    this.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY
    this.ACCESS_TOKEN_KEY_SECRET = process.env.ACCESS_TOKEN_KEY_SECRET
    this.setReply()  
  }
}
</script>
<style scoped lang="scss">
  header{
    width: 100%;
    height: 70px;
    border: 1px red solid;
    display: flex;
    justify-content: center; 
    align-items: center;
  }
  ul{
    width: 80%;
    margin: 0 auto;
    h2{
      font-size: 2.2em;
    }
    li{
      list-style: none;
      margin: 20px 0;
      padding: 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      box-shadow:0 0 5px 5px rgba(0,0,0,0.1);
      overflow-wrap: break-word;
      h3{
        white-space: pre-wrap;
        text-align: center;
        margin-bottom: 30px;
        color: red;
      }
      h3,p{
        width: 70%;
        text-align: center;
      }
      > div{
        width: 90%;
        display: flex;
        align-items: center;
        flex-direction: column;
        box-shadow:0 0 5px 5px rgba(0,0,0,0.1);
        padding: 20px;
        margin: 10px 0;
        .manage-send-sentence-box{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          div button, button{
            width: 50px;
            height: 30px;
            border: 1px solid rgba(0,0,0,0.3);
            border-radius: 5px;
            background: none;
            transition: .5s;
            cursor: pointer;
            &:hover{
              background-color: #d77;
              border: 1px solid rgba(200,0,0,1);
              color: white;
            }
          }
          .toggle-button{
            width: 100px;
            &:hover{
              background-color: rgb(48,48,48);
              border: 1px solid rgba(255,255,255,1);
            }
          }
          h4{
            width: 70%;
            white-space: pre-wrap;
            text-align: center;
          }
        }
      }
      .held{
        background-color: #333;
        color: white;
        div div button{
          color: white;
          border: 1px solid rgba(255,255,255,1);
        }
        .toggle-button{
          color: white;
          border: 1px solid rgba(255,255,255,1);
          &:hover{
            background-color: white;
            color: rgb(48,48,48);
          }
        }
      }
    }
  }
  p{
    margin: 5px 0;
  }
  @media (max-width: 520px) {
    ul{
      width: 100%;
      h2{
        font-size: 1.6em;
        margin-left: 10px;
      }
      li{
        padding: 20px 10px;
        margin: 10px 0;        
        h3{
          width: 90%;
          margin-bottom: 10px;
        }
        p{
          width: 90%;
        }
        >div {
          margin: 5px 0;
          padding: 10px;
          .manage-send-sentence-box {
            div{
              width: 50px;
              button{
                margin: 5px 0;
              }
            }
            h4{
              max-width: calc(100% - 120px);
            }
            .toggle-button{
              width: 50px;
              height: 70px;
            }
          }
        }
      }
    }
  }
</style>