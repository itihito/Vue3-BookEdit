<script setup lang="ts">
import SortBtn from "../components/SortBtn.vue";
import { ref, onMounted } from "vue";
import axiosClient from "../api/axiosClieant";
import {
  Book,
  BooksProps,
  SearchResultBook,
  SortSearchResultBookProperties,
} from "../typings/Types";
import router from "../router";
import { useHistoryState, onBackupState } from "vue-history-state";

const keyword = ref<string>("");
const searchResults = ref<SearchResultBook[]>([]);
const { books } = defineProps<BooksProps>();

const search = async (keyword: string) => {
  searchResults.value = [];
  const params = {
    q: `intitle:${keyword}`,
    maxResults: "40",
  };
  const response = await axiosClient.get("", { params });

  for (const book of response.data.items) {
    const { title, imageLinks, description, publishedDate } = book.volumeInfo;
    const bookId = book.id;

    const isAdded: boolean = books.some(
      (existingBook: Book) => existingBook.bookId === bookId
    );

    searchResults.value.push({
      bookId: bookId,
      title: title || "",
      description: description ? description.slice(0, 40) : "",
      image: imageLinks ? imageLinks.thumbnail : "",
      publishedDate: publishedDate || "",
      isAdded: isAdded,
    });
  }
};

const goToRegisterPage = (id: string) => {
  router.push({
    name: "BookRegister",
    params: { bookId: id },
  });
};

onBackupState(() => {
  return {
    keyword: keyword.value,
    searchResults: searchResults.value,
  };
});

onMounted(() => {
  const historyState = useHistoryState();

  if (historyState.data) {
    keyword.value = historyState.data.keyword;
    searchResults.value = historyState.data.searchResults;
  }
});

const sortSearchResultBookProps: SortSearchResultBookProperties[] = [
  {
    label: "発売日（新しい順）",
    sortKey: "publishedDate",
    order: "desc",
  },
  {
    label: "発売日（古い順）",
    sortKey: "publishedDate",
    order: "asc",
  },
  {
    label: "タイトル（昇順）",
    sortKey: "title",
    order: "asc",
  },
  {
    label: "タイトル（降順）",
    sortKey: "title",
    order: "desc",
  },
];

const sortByKey = (sortKey: keyof SearchResultBook, order: "asc" | "desc") => {
  return (a: SearchResultBook, b: SearchResultBook) => {
    const comparison =
      a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
    return order === "asc" ? comparison : -comparison;
  };
};

// keyに基づいてbooksをソート
const sortSearchResultBooks = (
  sortKey: keyof SearchResultBook,
  order: "asc" | "desc"
) => {
  let sortedBooks: SearchResultBook[] = [...searchResults.value];

  switch (sortKey) {
    case "title": // タイトル順
    case "publishedDate": // 発売日順
      sortedBooks.sort(sortByKey(sortKey, order));
      break;
    default:
      console.error("Invalid property for sorting");
  }

  searchResults.value = sortedBooks;
};
</script>

<template>
  <div>
    <!-- 検索インプット要素 -->
    <v-row class="d-flex justify-center">
      <v-col cols="6" class="d-flex pb-0">
        <v-text-field
          label="本のタイトルを検索"
          v-model="keyword"
          @keyup.enter="search(keyword)"
          autofocus
          hide-details="auto"
        ></v-text-field>
        <v-btn
          color="primary"
          @click="search(keyword)"
          height="100%"
          class="rounded-0 rounded-e-xl"
        >
          <v-icon color="white" size="x-large" class="search-icon"
            >mdi-magnify</v-icon
          >
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="mt-0 d-flex justify-end">
        <SortBtn
          :sort-book-props="sortSearchResultBookProps"
          :books="searchResults"
          @sort-Books="sortSearchResultBooks"
        />
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
        <v-card elevation="8">
          <v-row>
            <v-col cols="4" class="pl-8">
              <v-img height="160px" :src="book.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title>{{ book.title }}</v-card-title>
              <v-card-subtitle class="headline">{{
                book.description
              }}</v-card-subtitle>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-btn
                  class="bg-indigo px-4 rounded-pill"
                  elevation="8"
                  color="white"
                  :disabled="book.isAdded"
                  v-on:click="goToRegisterPage(book.bookId)"
                  ><v-icon>mdi-pencil</v-icon>感想を書く
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row></v-row>
  </div>
</template>

<style scoped>
.headline {
  text-overflow: inherit;
  white-space: unset;
}
.search-icon {
  transform: scale(1.4);
}
</style>
