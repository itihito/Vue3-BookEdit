import type { Commit } from "vuex";

type User = {
  name: string;
  uid: string;
  email: string;
};

interface State {
  user: User;
}

const initUser = (): User => {
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser;
  } else {
    return { name: "", uid: "", email: "" };
  }
};

const state: State = {
  user: initUser(),
};

const mutations = {
  SetUserState(state: State, payload: User) {
    state.user = payload;
    localStorage.setItem("user", JSON.stringify(payload));
  },
};

const actions = {
  SetUserStateAction({ commit }: { commit: Commit }, payload: User) {
    commit("SetUserState", payload);
  },
};

const getters = {
  getUser(state: State): User {
    return state.user;
  },
  getUid(state: State): string {
    return state.user.uid;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
