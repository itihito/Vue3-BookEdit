<script setup lang="ts">
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase.ts";

import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRouter } from "vue-router";

const email = ref<string>("");
const password = ref<string>("");
const currentUser = ref();
const store = useStore();
const router = useRouter();
const loginUserInfo = computed(() => {
  return store.state.auth.user;
});

// サインイン処理
const signIn = () => {
  // メールアドレスとパスワードが入力されているかを確認
  if (email.value == "" || email.value == "") return;
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      console.log(user);
      store.dispatch("auth/SetUserStateAction", {
        name: user.email,
        uid: user.uid,
      });
      router.push("/");
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

// サインアップ処理
const createAccount = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

onMounted(() => {
  // ログインしているユーザーを取得する
  onAuthStateChanged(auth, (user) => {
    if (user != null) {
      currentUser.value = user;
      console.log("user", user);
    } else {
      currentUser.value = null;
    }
  });
});
</script>

<template>
  <v-sheet width="600px" elevation="10" class="mx-auto">
    <v-container class="bg-teal-lighten-4">
      <v-sheet class="bg-teal-lighten-4 mx-auto" width="500px">
        <v-text-field v-model="email" bg-color="white" label="メールアドレス">
        </v-text-field>
        <v-text-field
          v-model="password"
          bg-color="white"
          label="パスワード"
        ></v-text-field>
        <v-sheet
          width="70%"
          class="bg-teal-lighten-4 d-flex justify-space-between mx-auto"
        >
          <v-btn @click="createAccount">新規登録</v-btn>
          <v-btn @click="signIn">ログイン</v-btn>
        </v-sheet>
      </v-sheet>
    </v-container>
  </v-sheet>
  {{ loginUserInfo }}
  <br />
</template>

<style scoped></style>
