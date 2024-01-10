<script setup lang="ts">
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

type Props = {
  uid: string;
};

const router = useRouter();
const store = useStore();
const { name: userName, email: userEmail } = store.getters["auth/getUser"];
const { uid } = defineProps<Props>();

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
      <v-sheet color="primary" v-if="!!uid">
        <v-btn class="bg-secondary" to="/"> 感想一覧 </v-btn>

        <v-menu transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-btn class="bg-white ml-4 mr-2" color="primary" v-bind="props">
              アカウント
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>
                <p>{{ userName || "名前未設定" }}さん</p>
                <p class="d-flex justify-center text-subtitle-2">
                  {{ userEmail }}
                </p>
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-title @click="logout" class="logout-item"
                >ログアウト<v-icon class="ml-2">mdi-logout</v-icon>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-sheet>
      <v-sheet color="primary" v-else="!!uid">
        <v-btn class="bg-white mr-2" color="indigo" to="/login"
          >ログイン<v-icon class="ml-2">mdi-login</v-icon>
        </v-btn>
      </v-sheet>
    </v-app-bar>
  </div>
</template>

<style lang="css" scoped>
.logout-item:hover {
  cursor: pointer;
}
</style>
