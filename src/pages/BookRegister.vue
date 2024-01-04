<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Book } from "../typings/Types";
import axiosClient from "../api/axiosClieant";
import router from "../router";

const route = useRoute();
const bookId = route.params.bookId as string;
const inputDate = ref();
const date = ref(formatDate(new Date()));
const inputMemo = ref<string>("");
const bookInfo = ref<Book>({
  uid: "", // 型定義エラー回避のための仮定義
  seq: -1, // 型定義エラー回避のための仮定義
  bookId: bookId,
  title: "",
  description: "",
  image: "",
  date: date.value,
  memo: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  try {
    const res = await axiosClient.get(bookId);
    const { title, description, imageLinks } = res.data.volumeInfo;

    bookInfo.value.title = title || "";
    bookInfo.value.description = description ? description.slice(0, 40) : "";
    bookInfo.value.image = imageLinks ? imageLinks.thumbnail || "" : "";
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const emit = defineEmits(["add-book-list"]);
const addBookList = () => {
  emit("add-book-list", {
    ...bookInfo.value,
    date: date.value,
    memo: inputMemo.value,
  });
};

function formatDate(inputDate: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(inputDate);
}

const updateDate = () => {
  if (inputDate.value) {
    date.value = formatDate(new Date(inputDate.value));
  }
};

const toToSearchPage = () => {
  router.back();
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-row>
            <v-col cols="4">
              <v-img :src="bookInfo.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title> タイトル：{{ bookInfo.title }} </v-card-title>
              読んだ日：
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="date"
                    readonly
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker
                  color="primary"
                  elevation="24"
                  v-model="inputDate"
                  @update:modelValue="updateDate"
                ></v-date-picker>
              </v-menu>
              感想：<v-textarea class="mx-2" v-model="inputMemo"></v-textarea>
              <v-card-actions>
                <v-btn class="bg-indigo" @click="toToSearchPage"
                  >検索結果に戻る</v-btn
                >
                <v-btn class="bg-info" @click="addBookList">登録する</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
