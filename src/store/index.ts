import Vue from "vue";
import Vuex from "vuex";
import { State } from "./types";
import { getInitialState } from "./getInitialState";
import { threadMutations } from './threads/mutations';

Vue.use(Vuex);


export default new Vuex.Store<State>({
  state: getInitialState(),
  mutations: { ...threadMutations }
});
