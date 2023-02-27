<template>
  <div>
    <header>
      <a class="nuxt-link" @click="toNewPost">ホームへ</a>
      <h1
        v-scroll-to="{
          element: '#app',
          offset: -200,
          duration: 500,
        }"
      >
        お手伝いサークル
      </h1>
      <input
        id="search-input"
        type="text"
        autocomplete="off"
        placeholder="語句で検索"
        v-model="qWord"
        @keyup.enter="searchPost(qWord)"
        @focus="toggleSearchWordModal(true)"
        @blur="toggleSearchWordModal(false)"
      />
      <transition>
        <div v-show="showSearchWord && !qWord" class="often-search-word-box">
          <h3>良く検索されるワード</h3>
          <ul>
            <li
              v-for="word in this.searchWords"
              :key="word"
              @click="inputSearchWord(word)"
            >
              {{ word }}
            </li>
          </ul>
        </div>
      </transition>
    </header>
    <div class="shadow-header"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showSearchWord: false,
      qWord: "",
      searchWords: [
        "#情報募集中の質問",
        "TOEFL",
        "サークル",
        "般教",
        "一般教養",
        "バイト",
      ],
    };
  },
  methods: {
    searchPost(word) {
      if (word) {
        this.$emit("searchPost", word);
      }
    },
    toggleSearchWordModal(boolean) {
      this.showSearchWord = boolean;
    },
    inputSearchWord(word) {
      this.searchPost(word);
      this.toggleSearchWordModal(false);
    },
    toNewPost() {
      this.$router.push("/");
      this.$emit("toNewPost");
    },
  },
};
</script>
<style lang="scss" scoped>
header {
  width: 100%;
  height: 70px;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
  background-color: white;
  z-index: 1000;
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
    cursor: pointer;
    user-select: none;
    &:hover {
      background-color: rgba(48, 48, 48, 1);
      color: white;
    }
  }
  h1 {
    z-index: 100;
    cursor: pointer;
    user-select: none;
  }
  button {
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

  input {
    z-index: 100;
    padding-left: 10px;
    width: calc(20% - 10px);
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    border: none;
    outline: none;
    font-size: 1.2em;
    transition: 0.5s;
    &:focus {
      background-color: rgb(48, 48, 48);
      color: white;
    }
  }
  .often-search-word-box {
    transform-origin: center center;
    position: absolute;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.8);
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    padding: 10px;
    overflow: scroll;
    box-shadow: 0px 10px 10px 1px rgba(0, 0, 0, 0.2);
    h3 {
      margin: 10px;
      color: white;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      li {
        list-style: none;
        width: 11%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid white;
        color: white;
        border-radius: 5px;
        margin: 0 calc((12% - 36px) / 16) 10px;
        cursor: pointer;
        transition: 0.5s;
        overflow: hidden;
        &:hover {
          background-color: rgb(48, 48, 48);
          color: white;
        }
      }
    }
  }
}
.shadow-header {
  width: 100%;
  height: 70px;
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
  header {
    height: 60px;
    h1 {
      display: none;
    }
    input {
      border-left: 1px solid rgb(200, 200, 200);
      width: 50%;
      padding-left: 0;
      text-align: center;
      border-radius: 0;
    }
    .nuxt-link {
      width: 50%;
    }
    button {
      width: 50%;
    }
    .often-search-word-box {
      padding: 10px 5px 0;
      ul {
        li {
          width: 30%;
          margin: 0 calc((10% - 16px) / 6) 10px;
        }
      }
    }
  }
  .shadow-header {
    height: 60px;
  }
}
</style>
