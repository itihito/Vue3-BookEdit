<script setup lang="ts">
import SortBtn from "../components/SortBtn.vue";
import { ref, onMounted, watch } from "vue";
import axiosClient from "../api/axiosClieant";
import {
  Book,
  BooksProps,
  SearchResultBook,
  SortSearchResultBookProperties,
  GoogleBooksApiOrderBy,
} from "../typings/Types";
import router from "../router";
import { useHistoryState, onBackupState } from "vue-history-state";

const { books } = defineProps<BooksProps>();
const SEARCH_RESULT_LENGTH = 40;

// 検索ワード
const keyword = ref<string>("");
// 現在検索しているワード。ページネーションで遷移する際に使用
const searchedKeyword = ref<string>("");
// 検索結果
const searchResults = ref<SearchResultBook[]>([]);
// 現在のページ
const currentPage = ref<number>(1);
const maxPage = ref<number>(1);
// 並び替え
const orderBy = ref<GoogleBooksApiOrderBy>("relevance");

// 検索する
const search = async (
  keyword: string,
  searchPage: number,
  isInitSearch: boolean,
  orderBy: GoogleBooksApiOrderBy
) => {
  currentPage.value = searchPage;
  const params = getSearchParams(keyword, searchPage, orderBy);
  const response = await axiosClient.get("", { params });
  searchResults.value = getSearchResult(response);

  // 初回検索のみ行う処理
  if (isInitSearch) {
    searchedKeyword.value = keyword;
    // 最大ページ数を設定
    maxPage.value = Math.ceil(
      Number(response.data.totalItems) / SEARCH_RESULT_LENGTH
    );
  }
};

const getSearchParams = (
  keyword: string,
  searchPage: number,
  orderBy: GoogleBooksApiOrderBy
) => {
  const params = {
    q: `intitle:${keyword}`,
    startIndex: SEARCH_RESULT_LENGTH * (searchPage - 1),
    maxResults: SEARCH_RESULT_LENGTH,
    orderBy: orderBy,
  };
  return params;
};

const getSearchResult = (response: any): SearchResultBook[] => {
  const newResults: SearchResultBook[] = [];
  for (const book of response.data.items) {
    const { title, imageLinks, description, publishedDate } = book.volumeInfo;
    const bookId = book.id;

    const isAdded: boolean = books.some(
      (existingBook: Book) => existingBook.bookId === bookId
    );

    newResults.push({
      bookId: bookId,
      title: title || "",
      description: description ? description.slice(0, 40) : "",
      image: imageLinks ? imageLinks.thumbnail : "",
      publishedDate: publishedDate || "",
      isAdded: isAdded,
    });
  }
  return newResults;
};

// ページ遷移の度に検索する
watch(currentPage, () => {
  search(searchedKeyword.value, currentPage.value, false, orderBy.value);
});

const goToRegisterPage = (id: string) => {
  router.push({
    name: "BookRegister",
    params: { bookId: id },
  });
};

// ブラウザバックや画面更新で値が失われないようステートに保持
onBackupState(() => {
  return {
    keyword: keyword.value,
    searchResults: searchResults.value,
    maxPage: maxPage.value,
    searchedKeyword: searchedKeyword.value,
    currentPage: currentPage.value,
  };
});

onMounted(() => {
  const historyState = useHistoryState();

  // 過去のステートが存在する場合、ステートから値を復元する
  if (historyState.data) {
    keyword.value = historyState.data.keyword;
    searchResults.value = historyState.data.searchResults;
    maxPage.value = historyState.data.maxPage;
    searchedKeyword.value = historyState.data.searchedKeyword;
    currentPage.value = historyState.data.currentPage;
  }
});

const sortSearchResultBookProps: SortSearchResultBookProperties[] = [
  {
    label: "関連度",
    sortKey: "relevance",
    order: "desc",
  },
  {
    label: "発売日（新しい順）",
    sortKey: "newest",
    order: "desc",
  },
];

// keyに基づいてbooksをソート
const sortSearchResultBooks = (
  sortKey: GoogleBooksApiOrderBy,
  _order: "asc" | "desc" // SortBtnでの型定義エラー解消のため受け取るだけで使用しない
) => {
  search(searchedKeyword.value, 1, true, sortKey);
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
          @keyup.enter="search(keyword, 1, true, orderBy)"
          autofocus
          hide-details="auto"
        ></v-text-field>
        <v-btn
          color="primary"
          @click="search(keyword, 1, true, orderBy)"
          height="100%"
          class="rounded-0 rounded-e-xl"
        >
          <v-icon color="white" size="x-large" class="search-icon"
            >mdi-magnify</v-icon
          >
        </v-btn>
      </v-col>
    </v-row>

    <!-- 並び替えボタン -->
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

    <!-- ページネーション -->
    <v-row justify="center">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination
            v-model="currentPage"
            class="my-4"
            :length="maxPage"
          ></v-pagination>
        </v-container>
      </v-col>
    </v-row>
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
