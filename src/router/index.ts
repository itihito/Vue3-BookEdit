import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BookIndex from "../pages/BookIndex.vue";
import BookSearch from "../pages/BookSearch.vue";
import BookEdit from "../pages/BookEdit.vue";
import Login from "../pages/Login.vue";
import authStore from "../store/auth/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "BookIndex",
    component: BookIndex,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/search",
    name: "BookSearch",
    component: BookSearch,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/edit/:bookId",
    name: "BookEdit",
    component: BookEdit,
    meta: {
      requiresAuth: true,
    },
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

router.beforeEach((to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.state.user.uid) {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
