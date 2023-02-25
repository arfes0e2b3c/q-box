<template>
  <div>
    <header>
      <nuxt-link to="/" class="nuxt-link">質問を見る</nuxt-link>
      <h1
        v-scroll-to="{
          element: '#app',
          offset: -200,
          duration: 500,
        }"
      >
        お手伝いサークル
      </h1>
      <div class="dummy-button"></div>
    </header>
    <div class="shadow-header"></div>
  </div>
</template>
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

  .dummy-button {
    z-index: 100;
    width: 20%;
    height: 100%;
    background-color: none;
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
    .dummy-button {
      width: 50%;
    }
  }
  .shadow-header {
    height: 60px;
  }
}
</style>
