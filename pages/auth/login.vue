<template>
  <section class="container">
    <div>
      <form @submit.prevent="submit">
        <label for="usernameTxt">Username:</label>
        <input id="usernameTxt" type="email" v-model="email" />
        <label for="passwordTxt">Password:</label>
        <input id="passwordTxt" type="password" v-model="password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";
import * as firebase from "firebase/auth";

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
    ...mapActions("modules/user", ["login"]),
    submit() {
      // const auth = firebase.getAuth();
      console.log(firebase);
      // firebase
      //   .signInWithEmailAndPassword(auth, this.email, this.password)
      //   .then((firebaseUser) => {
      //     return this.login(firebaseUser.uid);
      //   })
      //   .then((response) => {
      //     console.log(response);
      //   });
      // .then(() => {
      //   this.$router.push("/answer");
      // })
      // .catch((error) => {
      //   console.log(error.message);
      // });
      //デフォルトではauthUrlはログイン用のURL
      const authUrl =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
        this.$config.firebaseApiKey;
      const signinData = {
        email: this.email,
        password: this.password,
        returnSecureToken: true,
      };
      this.$axios
        .$post(authUrl, signinData)
        .then((response) => {
          this.login(response.idToken);
          this.$router.push("/answer");
          console.log(111);
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
