<template>
  <div id="app">
    <header>
      <nuxt-link to="/answer">管理者ページ</nuxt-link>
      <h1
        v-scroll-to="{
          element: '#app',
          offset: -200,
          duration: 500,
        }"
      >
        質問箱
      </h1>
      <input
        id="search-input"
        type="text"
        autocomplete="off"
        placeholder="語句で検索"
        v-model="qWord"
        @keyup.enter="searchPost(qWord)"
        @click="toggleSearchWord(!showSearchWord)"
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
    <div @click="toggleSearchWord(false)">
      <NewPost v-show="showNewPost" class="new-post" />
      <FilteredPost
        v-show="showFilteredPost"
        ref="FilteredPost"
        class="filtered-post"
      />
      <div
        class="chevron-up"
        v-scroll-to="{
          element: '#app',
          offset: -200,
          duration: 500,
        }"
      >
        <fa :icon="faChevronUp" />
      </div>
    </div>
  </div>
</template>

<script>
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
export default {
  data() {
    return {
      faChevronUp,
      showNewPost: true,
      showFilteredPost: false,
      qWord: "",
      showSearchWord: false,
      searchWords: [
        "#情報募集中の質問",
        "TOEFL",
        "サークル",
        "般教",
        "一般教養",
        "バイト",
      ],
      meta: {
        title: "",
        description: "",
        type: "",
        url: "",
        image: "",
      },
    };
  },
  head() {
    this.meta.description = "質問箱ですわ";
    this.meta.type = "article";
    this.meta.url = "https://unique-donut-e9d728.netlify.app/";
    this.meta.image =
      "https://images.microcms-assets.io/assets/ca0c41f03efd472a910782fea07dff31/e8ff8e3ccffd4e89b37680d70a3b6d26/answered.png?w=1200&h=630&blend-mode=normal&blend-align=middle,center&blend=https%3A%2F%2Fassets.imgix.net%2F~text%3Fw%3D1000%26txt-color%3D333%26txt-align%3Dcenter%26txt-size%3D36%26txtfont%3DHiragino%20Sans%20W6%26txt%3D質問箱です";
    this.meta.title = "質問や過去の回答はこちらから";

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
      this.showNewPost = false;
      this.showFilteredPost = true;
    },
    toggleSearchWord(boolean) {
      this.showSearchWord = boolean;
    },
    inputSearchWord(word) {
      this.searchPost(word);
      this.toggleSearchWord(false);
    },
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
<style scoped lang="scss">
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
  h1 {
    z-index: 100;
    cursor: pointer;
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
.new-post,
.filtered-post {
  margin-top: 70px;
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
.chevron-up {
  display: none;
}
@media (max-width: 520px) {
  header {
    height: 60px;
    h1 {
      display: none;
    }
    input {
      border-left: 1px solid rgb(48, 48, 48);
      width: 50%;
      padding-left: 0;
      text-align: center;
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
  .chevron-up {
    position: fixed;
    bottom: 40px;
    right: 30px;
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid white;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 2.2em;
  }
}
</style>
