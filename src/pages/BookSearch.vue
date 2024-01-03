<script setup lang="ts">
import { ref } from "vue";
import axiosClient from "../api/axiosClieant";
import { Book, SearchResultBook } from "../typings/Types";
import router from "../router";

type Props = {
  books: Book[];
};

const keyword = ref<string>("");
const searchResults = ref<SearchResultBook[]>([]);
const { books } = defineProps<Props>();

const search = async (keyword: string) => {
  searchResults.value = [];
  const params = {
    q: `intitle:${keyword}`,
    maxResults: "40",
  };
  const response = await axiosClient.get("", { params });

  for (const book of response.data.items) {
    const title = book.volumeInfo.title;
    const img = book.volumeInfo.imageLinks;
    const description = book.volumeInfo.description;
    const bookId = book.id;

    const isAdded: boolean = books.some(
      (existingBook: Book) => existingBook.bookId === bookId
    );

    searchResults.value.push({
      bookId: bookId,
      title: title ? title : "",
      description: description ? description.slice(0, 40) : "",
      image: img ? img.thumbnail : "",
      isAdded: isAdded,
    });
  }
};

const emit = defineEmits(["add-book-list"]);

const goToRegisterPage = (id: string) => {
  router.push(`register/${id}`);
};
</script>

<template>
  <div>
    <!-- 検索インプット要素 -->
    <v-row class="d-flex justify-center">
      <v-col cols="6">
        <v-text-field
          label="本のタイトルを検索"
          v-model="keyword"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- 検索＆一覧に戻るボタン -->
    <v-row class="d-flex justify-center">
      <v-col cols="3" class="d-flex justify-center">
        <v-btn color="primary" @click="search(keyword)">検索する</v-btn>
      </v-col>
      <v-col cols="3" class="d-flex justify-center">
        <v-btn color="secondary" to="/"> 一覧に戻る </v-btn>
      </v-col>
    </v-row>

    <!-- 検索結果 -->
    <v-row>
      <v-col
        cols="12"
        xl="3"
        lg="4"
        md="6"
        sm="6"
        v-for="(book, index) in searchResults"
        :key="index"
      >
        <v-card class="mx-auto" height="180px" elevation="8">
          <v-row>
            <v-col cols="4">
              <v-img height="160px" :src="book.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title>{{ book.title }}</v-card-title>
              {{ book.description }}
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-btn
                  class="bg-indigo"
                  elevation="8"
                  color="white"
                  icon="mdi-plus"
                  :disabled="book.isAdded"
                  v-on:click="goToRegisterPage(book.bookId)"
                />
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row></v-row>
  </div>
</template>

<style scoped></style>
