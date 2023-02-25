<template>
  <section class="container">
    <div>
      <form @submit.prevent="onLogin">
        <label for="usernameTxt">Username:</label>
        <input id="usernameTxt" type="email" v-model="email" />
        <label for="passwordTxt">Password:</label>
        <input id="passwordTxt" type="password" v-model="password" />
        <button type="submit">Sign In</button>
      </form>
      <form @submit.prevent="onLogout">
        <button type="submit">Sign Out</button>
      </form>
    </div>
  </section>
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
  middleware: ["handle-login-route"],
  methods: {
    ...mapActions("modules/user", ["login", "logout"]),
    onLogin() {
      const fAuth = auth.getAuth();
      console.log(fAuth);
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
};
</script>

<style scoped>
form {
  padding: 16px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

/* button {
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
  } */

button:hover {
  opacity: 0.8;
}

.container {
  padding: 16px;
  max-width: 400px;
}
</style>
