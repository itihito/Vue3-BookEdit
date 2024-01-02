<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Book } from "../typings/Types";
import axiosClient from "../api/axiosClieant";
import { onMounted } from "vue";

const route = useRoute();
const bookId = route.params.bookId as string;
const readDate = ref();
const date = ref(formatDate(new Date()));

let newBook = ref({} as Book);
const fetchData = async () => {
  try {
    const res = await axiosClient.get(bookId);
    const title = res.data.volumeInfo.title;
    const img = res.data.volumeInfo.imageLinks;
    const description = res.data.volumeInfo.description;
    newBook.value = {
      seq: 1,
      bookId: bookId,
      title: title ? title : "",
      description: description ? description.slice(0, 40) : "",
      image: img ? img.thumbnail : "",
      readDate: date.value,
      memo: "",
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(async () => {
  await fetchData();
});

const emit = defineEmits(["add-book-list"]);
const addBookList = () => {
  emit("add-book-list", newBook.value);
};

function formatDate(inputDate: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(inputDate);
}

const updateDate = () => {
  date.value = readDate.value.toISOString().substring(0, 10);
  const formattedDate = formatDate(readDate.value);
  date.value = formattedDate;
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-row>
            <v-col cols="4">
              <v-img :src="newBook.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title> タイトル：{{ newBook.title }} </v-card-title>
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
                  v-model="readDate"
                  @update:modelValue="updateDate"
                ></v-date-picker>
              </v-menu>
              感想：<v-textarea
                class="mx-2"
                v-model="newBook.memo"
              ></v-textarea>
              <v-card-actions>
                <v-btn class="bg-secondary" to="/">一覧に戻る</v-btn>
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
