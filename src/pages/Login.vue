<script setup lang="ts">
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.ts";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const email = ref<string>("");
const password = ref<string>("");
const store = useStore();
const router = useRouter();

onMounted(() => {
  // ログインしているユーザーを取得する
  onAuthStateChanged(auth, (user) => {
    if (user && !!store.getters["auth/getUid"]) {
      // ログイン済み、かつuidがstoreに存在する場合はインデックス画面に遷移させる
      router.push("/");
    }
  });
});

// サインイン処理
const signIn = () => {
  // メールアドレスとパスワードが入力されているかを確認
  if (email.value === "" || password.value === "") return;

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      store.dispatch("auth/SetUserStateAction", {
        name: user.displayName,
        uid: user.uid,
        email: user.email,
      });
      await router.push("/");
      location.reload();
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
};

const loginBtnCSS = computed(() => {
  if (email.value.length >= 1 && password.value.length >= 6) {
    return "font-weight-bold text-white bg-blue";
  } else {
    return "font-weight-bold text-grey-darken-1 bg-grey-lighten-2";
  }
});

const loginBtnIsDisabled = computed(() => {
  if (email.value.length >= 1 && password.value.length >= 6) {
    return false;
  } else {
    return true;
  }
});
</script>

<template>
  <v-sheet max-width="600px" elevation="10" class="mx-auto">
    <v-container class="bg-teal-lighten-4">
      <v-sheet class="bg-teal-lighten-4 mx-auto" max-width="90%">
        <v-text-field v-model="email" bg-color="white" label="メールアドレス">
        </v-text-field>
        <v-text-field
          v-model="password"
          bg-color="white"
          label="パスワード(6桁以上)"
          type="password"
        ></v-text-field>
        <v-sheet class="bg-teal-lighten-4 mx-auto">
          <v-btn
            :class="loginBtnCSS"
            width="100%"
            @click="signIn"
            :disabled="loginBtnIsDisabled"
            >ログイン</v-btn
          >
        </v-sheet>
      </v-sheet>
    </v-container>
    <v-divider class="border-opacity-50"></v-divider>
    <v-container class="bg-teal-lighten-4 d-flex justify-center">
      <v-btn to="/user/register">ユーザー登録はこちら</v-btn>
    </v-container>
  </v-sheet>
</template>

<style scoped></style>
