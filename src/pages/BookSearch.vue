<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { Book } from "../App.vue";

const keyword = ref<string>("");
const searchResults = ref<Book[]>([]);
const search = async (keyword: string) => {
  searchResults.value = [];
  const baseUrl = "https://www.googleapis.com/books/v1/volumes?";
  const params = {
    q: `intitle:${keyword}`,
    maxResults: "40",
  };
  const queryParams = new URLSearchParams(params);

  const response = await axios.get(baseUrl + queryParams);

  for (const book of response.data.items) {
    const title = book.volumeInfo.title;
    const img = book.volumeInfo.imageLinks;
    const description = book.volumeInfo.description;
    searchResults.value.push({
      id: null,
      title: title ? title : "",
      description: description ? description.slice(0, 40) : "",
      image: img ? img.thumbnail : "",
      readDate: "",
      memo: "",
    });
  }
};

const emit = defineEmits(["add-book-list"]);
const addBookList = (index: number) => {
  emit("add-book-list", searchResults.value[index]);
};
</script>

<template>
  <div>
    <!-- 検索インプット要素 -->
    <v-row>
      <v-col cols="6">
        <v-text-field
          label="本のタイトルを検索"
          v-model="keyword"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- 検索＆一覧に戻るボタン -->
    <v-row>
      <v-col cols="3">
        <v-btn color="primary" @click="search(keyword)">検索する</v-btn>
      </v-col>
      <v-col>
        <v-btn color="secondary" to="/"> 一覧に戻る </v-btn>
      </v-col>
    </v-row>

    <!-- 検索結果 -->
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(book, index) in searchResults"
        :key="index"
      >
        <v-card class="mx-auto">
          <v-row>
            <v-col cols="4">
              <v-img :src="book.image"></v-img>
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
                  v-on:click="addBookList(index)"
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
