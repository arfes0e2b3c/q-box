export default function ({ store, redirect }) {
  console.log("authenticating");
  if (!store.getters["modules/user/isAuthenticated"]) {
    console.log("authenticated");
    return redirect("/auth/login");
  }
}
