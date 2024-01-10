<script setup lang="ts">
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.ts";
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { VForm } from "vuetify/lib/components/index.mjs";

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

// v-formのref="form"により自動的にバインドしている変数
const form = ref<typeof VForm>();
// バリデーション結果
let valid = ref<boolean>(false);
// formの値が変更されるたびにバリデーション結果を更新
watch([email, password], async () => {
  // インプット要素が全て入力されている場合
  if (email.value && password.value) {
    const validationResult = await form?.value?.validate();
    valid.value = validationResult?.valid || false;
  }
});

const loginBtnCSS = computed(() => {
  return valid.value
    ? "font-weight-bold text-white bg-blue"
    : "font-weight-bold text-grey-darken-1 bg-grey-lighten-2";
});

const emailRules = [
  (v: string) => !!v || "メールアドレスは必須です",
  (v: string) =>
    /^\S+@\S+\.\S+$/.test(v) || "有効なメールアドレスを入力してください",
];
const passwordRules = [
  (v: string) => !!v || "パスワードは必須です",
  (v: string) =>
    (v && v.length >= 6) || "パスワードは6文字以上で入力してください",
];
</script>

<template>
  <v-sheet max-width="600px" elevation="10" class="mx-auto">
    <v-container class="bg-teal-lighten-4">
      <v-sheet class="bg-teal-lighten-4 mx-auto" max-width="90%">
        <v-form ref="form">
          <v-text-field
            v-model="email"
            bg-color="white"
            label="メールアドレス"
            :rules="emailRules"
            required
          >
          </v-text-field>
          <v-text-field
            v-model="password"
            bg-color="white"
            label="パスワード(6桁以上)"
            type="password"
            :rules="passwordRules"
            required
          ></v-text-field>
          <v-sheet class="bg-teal-lighten-4 mx-auto">
            <v-btn
              :class="loginBtnCSS"
              width="100%"
              @click="signIn"
              :disabled="!valid"
              >ログイン</v-btn
            >
          </v-sheet>
        </v-form>
      </v-sheet>
    </v-container>
    <v-divider class="border-opacity-50"></v-divider>
    <v-container class="bg-teal-lighten-4 d-flex justify-center">
      <v-btn to="/user/register">ユーザー登録はこちら</v-btn>
    </v-container>
  </v-sheet>
</template>

<style scoped></style>
