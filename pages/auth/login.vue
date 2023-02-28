<template>
  <div id="app">
    <SharedLoginHeader />
    <div class="container">
      <div class="form">
        <form @submit.prevent="onLogin" class="form__inner">
          <h2>管理者としてログイン</h2>
          <input
            id="usernameTxt"
            type="email"
            v-model="email"
            placeholder="メールアドレス"
          />
          <input
            id="passwordTxt"
            type="password"
            v-model="password"
            placeholder="パスワード"
          />
          <button type="submit" class="submit-button">ログインする</button>
        </form>
      </div>
    </div>
    <SharedFooter />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import * as auth from "firebase/auth";

export default {
  layout: "default",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  // middleware: ["handle-login-route"],
  methods: {
    ...mapActions("modules/user", ["login", "logout"]),
    onLogin() {
      const fAuth = auth.getAuth();
      auth
        .signInWithEmailAndPassword(fAuth, this.email, this.password)
        .then((firebaseUser) => {
          return this.login(fAuth);
        })
        .then(() => {
          this.$router.push("/answer");
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
</script>
<style>
@font-face {
  font-family: "azuki", "メイリオ";
  src: url("~@/assets/fonts/azuki.ttf") format("truetype");
}
* {
  font-family: azuki, "メイリオ";
  margin: 0;
  padding: 0;
}
</style>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 221px);
  .form {
    width: 700px;
    height: 400px;
    margin: 0 auto;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.1);
    .form__inner {
      padding: 50px 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      h2 {
        margin: 10px 0;
        font-size: 28px;
      }
      input {
        width: 100%;
        padding: 10px;
        margin: 20px 0;
        box-sizing: border-box;
        color: #333 !important;
        border: none;
        border-bottom: 2px solid rgba(0, 0, 0, 0.15);
        border-radius: 0;
        transition: 0.2s;
        outline: none;
        text-align: center;
        font-size: 18px;
        transition: 0.2s;
        &:focus {
          border-color: rgba(0, 0, 0, 0.7);
        }
      }
      #passwordTxt {
        font-family: "Courier New", Courier, monospace;
      }
      .submit-button {
        position: relative;
        width: 200px;
        height: 60px;
        margin-top: 20px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 1px;
        transition: 0.2s;
        cursor: pointer;
        overflow: hidden;
        &:before {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          content: "";
          width: 0;
          height: 0;
          background-color: white;
          opacity: 0.2;
          transition: 0.3s;
        }
        &:hover {
          &:before {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
@media (max-width: 520px) {
  .container {
    .form {
      width: 100%;
      height: 350px;
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
      .form__inner {
        padding: 30px 30px;
        h2 {
          margin: 10px 0;
          font-size: 24px;
        }
        input {
          width: 100%;
          padding: 10px;
          margin: 20px 0;
          box-sizing: border-box;
          color: #333 !important;
          border: none;
          border-bottom: 2px solid rgba(0, 0, 0, 0.15);
          transition: 0.2s;
          outline: none;
          text-align: center;
          font-size: 18px;
          transition: 0.2s;
          &:focus {
            border-color: rgba(0, 0, 0, 0.7);
          }
        }
        .submit-button {
          position: relative;
          width: 200px;
          height: 60px;
          margin-top: 20px;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 1px;
          transition: 0.2s;
          cursor: pointer;
          overflow: hidden;
          &:before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            content: "";
            width: 0;
            height: 0;
            background-color: white;
            opacity: 0.2;
            transition: 0.3s;
          }
          &:hover {
            &:before {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
