import { onAuthStateChanged } from "firebase/auth";
import type { Commit } from "vuex";
import { auth } from "../../firebase/firebase";

type User = {
  name: string;
  uid: string;
};

interface State {
  user: User;
}

const initUser = async (): Promise<User> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData: User = { name: user.displayName || "", uid: user.uid };
        resolve(userData);
      } else {
        const defaultUser: User = { name: "", uid: "" };
        resolve(defaultUser);
      }

      // コールバックを解除
      unsubscribe();
    });
  });
};

const state: State = {
  user: await initUser(),
};

const mutations = {
  SetUserState(state: State, payload: User) {
    state.user = payload;
  },
};

const actions = {
  SetUserStateAction({ commit }: { commit: Commit }, payload: User) {
    commit("SetUserState", payload);
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
