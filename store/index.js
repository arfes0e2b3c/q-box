import { getUserFromCookie, getUserFromSession } from "@/helpers";

export const state = () => ({
  isReplied: false,
  isReplyPage: false,
});

export const mutations = {
  setIsReplied(state, isReplied) {
    state.isReplied = isReplied;
  },
  setIsReplyPage(state, isReplyPage) {
    state.isReplyPage = isReplyPage;
  },
};

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    const user = getUserFromCookie(req);
    if (user) {
      await dispatch("modules/user/setUSER", {
        name: user.name,
        email: user.email,
        avatar: user.picture,
        uid: user.user_id,
      });
    }
  },
};
