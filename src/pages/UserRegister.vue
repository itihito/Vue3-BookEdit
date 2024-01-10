<script setup lang="ts">
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.ts";
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { VForm } from "vuetify/lib/components/index.mjs";

const userName = ref<string>("");
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

const createUser = async () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // ユーザーのdisplayNameを設定
      await updateProfile(user, { displayName: userName.value });

      // 成功時処理
      store.dispatch("auth/SetUserStateAction", {
        name: userName.value,
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

const form = ref<typeof VForm>();
let valid = ref<boolean>(false);
// formの値が変更されるたびにバリデーション結果をを更新
watch([userName, email, password], async () => {
  // インプット要素が全て入力されている場合
  if (userName.value && email.value && password.value) {
    const validationResult = await form?.value?.validate();
    valid.value = validationResult?.valid || false;
  }
});

const registerBtnCSS = computed(() => {
  return valid.value
    ? "font-weight-bold text-white bg-blue"
    : "font-weight-bold text-grey-darken-1 bg-grey-lighten-2";
});

const nameRules = [
  (v: string) => !!v || "ユーザー名は必須です",
  (v: string) =>
    (v && v.length >= 4) || "ユーザー名は4文字以上入力してください",
  (v: string) => (v && v.length <= 10) || "ユーザー名は10文字まで入力可能です",
];
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
  <div>
    <v-sheet max-width="600px" elevation="10" class="mx-auto">
      <v-container class="bg-teal-lighten-4">
        <v-sheet class="bg-teal-lighten-4 mx-auto" max-width="90%">
          <v-form ref="form">
            <v-text-field
              v-model="userName"
              bg-color="white"
              label="ユーザー名"
              :rules="nameRules"
              required
            >
            </v-text-field>
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
            <v-sheet class="bg-teal-lighten-4 d-flex justify-center">
              <v-btn
                :class="registerBtnCSS"
                width="100%"
                @click="createUser"
                :disabled="!valid"
                >ユーザー登録</v-btn
              >
            </v-sheet>
          </v-form>
        </v-sheet>
      </v-container>
      <v-divider class="border-opacity-50"></v-divider>
      <v-container class="bg-teal-lighten-4 d-flex justify-center">
        <v-btn to="/login">ログインはこちら</v-btn>
      </v-container>
    </v-sheet>
  </div>
</template>

<style scoped></style>
