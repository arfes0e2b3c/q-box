<template>
  <div id="app">
    <SharedHeader @searchPost="searchPost" />
    <div>
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
    this.meta.description = "お手伝いサークルの質問箱";
    this.meta.type = "article";
    this.meta.url = this.$config.baseUrl;
    this.meta.image =
      "https://images.microcms-assets.io/assets/ca0c41f03efd472a910782fea07dff31/e8ff8e3ccffd4e89b37680d70a3b6d26/answered.png?w=1200&h=630&blend-mode=normal&blend-align=middle,center&blend=https%3A%2F%2Fassets.imgix.net%2F~text%3Fw%3D1000%26txt-color%3D333%26txt-align%3Dcenter%26txt-size%3D36%26txtfont%3DHiragino%20Sans%20W6%26txt%3Dお手伝いサークルの質問箱";
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
    searchPost(word) {
      this.$refs.FilteredPost.getPost(word);
      this.changeShowMode();
    },
    changeShowMode() {
      this.showNewPost = false;
      this.showFilteredPost = true;
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
.new-post,
.filtered-post {
  margin-top: 70px;
}

.chevron-up {
  display: none;
}
@media (max-width: 520px) {
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
