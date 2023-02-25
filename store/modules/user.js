import Cookies from "js-cookie";

export const state = () => ({
  uid: null,
  user: null,
});

export const getters = {
  uid(state) {
    if (state.user && state.user.uid) return state.user.uid;
    else return null;
  },

  user(state) {
    return state.user;
  },

  isAuthenticated(state) {
    return !!state.user && !!state.user.uid;
  },
};

export const actions = {
  async login({ dispatch, state }, auth) {
    const token = await auth.currentUser.getIdToken(true);
    const userInfo = {
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      uid: auth.currentUser.uid,
    };

    Cookies.set("access_token", token); // saving token in cookie for server rendering
    await dispatch("setUSER", userInfo);
    await dispatch("saveUID", userInfo.uid);
  },

  async logout({ commit, dispatch }) {
    Cookies.remove("access_token");
    commit("setUSER", null);
    commit("saveUID", null);
  },

  saveUID({ commit }, uid) {
    commit("saveUID", uid);
  },

  setUSER({ commit }, user) {
    commit("setUSER", user);
  },
};

export const mutations = {
  saveUID(state, uid) {
    state.uid = uid;
  },
  setUSER(state, user) {
    state.user = user;
  },
};
