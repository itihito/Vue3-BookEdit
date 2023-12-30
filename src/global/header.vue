<script setup lang="ts">
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const emit = defineEmits(["delete-local-storage"]);
const deleteLocalStorage = () => {
  emit("delete-local-storage");
};

const logout = () => {
  signOut(auth)
    .then(() => {
      // ログアウト成功
      console.log("ログアウト成功");
    })
    .catch(() => {
      // ログアウト失敗
      console.log("ログアウト失敗");
    });
};
</script>

<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
      <v-btn class="bg-error" color="" v-on:click="deleteLocalStorage"
        >すべて削除する</v-btn
      >
      <v-btn class="bg-error ml-4" @click="logout">ログアウト</v-btn>
    </v-app-bar>
  </div>
</template>

<style lang="css" scoped></style>
