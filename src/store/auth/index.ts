import type { MutationTree, ActionTree } from "vuex";

type User = {
  name: string;
  uid: string;
};

interface State {
  user: User;
}

const initUser = (): User => {
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser;
  }
  return { name: "", uid: "" };
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
  SetUserStateAction({ commit }, payload: User) {
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
