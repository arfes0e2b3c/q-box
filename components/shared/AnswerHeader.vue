<template>
    <div class="shadow-header"></div>
</template>
<script>
export default {
  methods: {
    changeShowMode() {
      this.$emit("chageShowMode");
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
  }
  .shadow-header {
    width: 100%;
    height: 60px;
  }
}
</style>
