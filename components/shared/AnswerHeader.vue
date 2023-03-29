<template>
  <div>
    <header>
      <button @click="onLogout">ログアウト</button>
      <h1
        v-scroll-to="{
          element: '#app',
          offset: -200,
          duration: 500,
        }"
      >
        お手伝いサークル(管理者版)
      </h1>
      <button
        @click="changeShowMode"
        :class="{ 'has-alert': isReplied && !isReplyPage }"
      >
        画面切り替え
      </button>
    </header>
    <div class="shadow-header"></div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import * as auth from "firebase/auth";
export default {
  methods: {
    ...mapActions("modules/user", ["logout"]),
    changeShowMode() {
      this.$emit("chageShowMode");
    },
    onLogout() {
      const fAuth = auth.getAuth();
      auth
        .signOut(fAuth)
        .then(() => {
          return this.logout();
        })
        .then(() => {
          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
  computed: {
    isReplied() {
      return this.$store.state.isReplied;
    },
    isReplyPage() {
      return this.$store.state.isReplyPage;
    },
  },
};
</script>
<style lang="scss" scoped>
header {
  width: 100%;
  height: 70px;
  background-color: white;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  h1 {
    cursor: pointer;
  }
  .nuxt-link {
    width: 20%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    text-decoration: none;
    transition: 0.5s;
    &:hover {
      background-color: rgba(48, 48, 48, 1);
      color: white;
    }
  }

  button {
    position: relative;
    width: 20%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    text-decoration: none;
    transition: 0.5s;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: rgba(48, 48, 48, 1);
      color: white;
    }
  }
  .has-alert::after {
    content: url("~/assets/img/alert.svg");
    position: absolute;
    top: 50%;
    left: 75%;
    transform: translate(-50%, -50%);
    width: 30px;
  }
}
.shadow-header {
  width: 100%;
  height: 70px;
}
@media (max-width: 520px) {
  header {
    height: 60px;
    h1 {
      display: none;
    }
    .nuxt-link {
      width: 50%;
    }
    button {
      border-left: 1px solid rgb(200, 200, 200);
      width: 50%;
    }
    .has-alert::after {
      left: 85%;
      width: 20px;
    }
  }
  .shadow-header {
    width: 100%;
    height: 60px;
  }
}
</style>
