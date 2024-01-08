<script setup lang="ts">
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useRouter } from "vue-router";

const router = useRouter();
const { isAuth } = defineProps(["isAuth"]);

const logout = async () => {
  try {
    await signOut(auth);
    console.log("ログアウト成功");
    localStorage.removeItem("user");
    await router.push({ name: "Login" });
    location.reload();
  } catch (error) {
    console.log("ログアウト失敗");
  }
};
</script>

<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn class="text-h5" href="/">読書感想アプリ</v-btn>
      <v-spacer></v-spacer>
      <v-sheet color="primary" v-if="isAuth">
        <v-btn class="bg-secondary" to="/"> 感想一覧 </v-btn>
        <v-btn class="bg-error ml-4 mr-2" @click="logout"
          >ログアウト<v-icon class="ml-2">mdi-logout</v-icon>
        </v-btn>
      </v-sheet>
      <v-sheet color="primary" v-else="isAuth">
        <v-btn class="bg-white mr-2" color="indigo" to="/login"
          >ログイン<v-icon class="ml-2">mdi-login</v-icon>
        </v-btn>
      </v-sheet>
    </v-app-bar>
  </div>
</template>

<style lang="css" scoped></style>
