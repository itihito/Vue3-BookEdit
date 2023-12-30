import type { MutationTree, ActionTree } from "vuex";

type User = {
  name: string;
  uid: string;
};

interface State {
  user: User;
}

const state: State = {
  user: { name: "taro", uid: "" },
};

const mutations: MutationTree<State> = {
  SetUserState(state: State, payload: User) {
    state.user = payload;
  },
};

const actions: ActionTree<State, any> = {
  SetUserStateAction({ commit }, payload: any) {
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
