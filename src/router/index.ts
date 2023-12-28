import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BookIndex from "../pages/BookIndex.vue";
import BookSearch from "../pages/BookSearch.vue";
import BookEdit from "../pages/BookEdit.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "BookIndex",
    component: BookIndex,
  },
  {
    path: "/search",
    name: "BookSearch",
    component: BookSearch,
  },
  {
    path: "/edit/:id",
    name: "BookEdit",
    component: BookEdit,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
