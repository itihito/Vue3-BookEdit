import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useStore } from "vuex";
import BookIndex from "../pages/BookIndex.vue";
import BookSearch from "../pages/BookSearch.vue";
import BookEdit from "../pages/BookEdit.vue";
import Login from "../pages/Login.vue";
import BookRegister from "../pages/BookRegister.vue";
import UserRegister from "../pages/UserRegister.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "BookIndex",
    component: BookIndex,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/user/register",
    name: "UserRegister",
    component: UserRegister,
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
    path: "/register/:bookId",
    name: "BookRegister",
    component: BookRegister,
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
  history: createWebHashHistory(),
  routes,
});

// ナビゲーションガード
router.beforeEach((to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const store = useStore();
    // ログインしていない場合はインデックスにリダイレクトさせる
    if (!store.getters["auth/getUid"]) {
      next({
        path: "/",
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
