<template>
  <div id="app">
    <SharedAnswerHeader @chageShowMode="changeShowMode" />
    <AnswerWaitPost v-show="showPost" class="answer-wait-post" />
    <AnswerWaitReply v-show="showReply" class="answer-wait-reply" />
    <AnswerKeepPost v-show="showKeep" class="answer-keep-post" />
    <SharedFooter />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  layout: "protected",
  middleware: "authenticated",
  data() {
    return {
      showModeNumber: 0,
    };
  },
  computed: {
    showPost() {
      return this.showModeNumber % 3 === 0;
    },
    showReply() {
      return this.showModeNumber % 3 === 1;
    },
    showKeep() {
      return this.showModeNumber % 3 === 2;
    },
  },
  methods: {
    changeShowMode() {
      this.showModeNumber++;
    },
    toQBox() {
      window.open(this.$config.baseUrl, "_blank");
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
<style lang="scss" scoped>
#app {
  .answer-wait-reply,
  .answer-wait-post,
  .answer-keep-post {
    min-height: calc(100vh - 241px);
  }
}
</style>
