<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Book, BookDetailInfo } from "../typings/Types";
import axiosClient from "../api/axiosClieant";
import { useHistoryState, onBackupState } from "vue-history-state";
import router from "../router";
import BookDetail from "../components/bookDetail.vue";

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
  author: "",
  publisher: "",
  publishedDate: "",
  language: "",
  printedPageCount: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
let bookDetailInfo = ref<BookDetailInfo[]>([]);

onMounted(async () => {
  const { historyDate, historyMemo } = getHistoryState();
  console.log("historyDate", historyDate);
  console.log("historyMemo", historyMemo);

  await fetchData(historyDate, historyMemo);
});

const fetchData = async (historyDate?: string, historyMemo?: string) => {
  try {
    const res = await axiosClient.get(bookId);
    setBookInfo(res);
    setBookDetailInfo();

    date.value = historyDate || "";
    inputMemo.value = historyMemo || "";
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const setBookInfo = (res: any) => {
  const {
    title,
    description,
    imageLinks,
    authors,
    publisher,
    publishedDate,
    language,
    printedPageCount,
  } = res.data.volumeInfo;
  console.log("res.data.volumeInfo", res.data);

  bookInfo.value.title = title || "";
  bookInfo.value.description = description ? description.slice(0, 40) : "";
  bookInfo.value.image = imageLinks.medium
    ? convertUrlHttpToHttps(imageLinks.medium)
    : imageLinks.thumbnail || "";
  bookInfo.value.author = authors.join("/") || "";
  bookInfo.value.publisher = publisher || "";
  bookInfo.value.publishedDate = publishedDate || "";
  bookInfo.value.language = language || "";
  bookInfo.value.printedPageCount = printedPageCount || "";
};

const setBookDetailInfo = () => {
  bookDetailInfo.value = [
    {
      label: "著者 ",
      value: bookInfo.value.author,
    },
    {
      label: "出版社 ",
      value: bookInfo.value.publisher,
    },
    {
      label: "発売日",
      value: convertHyphenToSlash(bookInfo.value.publishedDate),
    },
    {
      label: "言語 ",
      value: getLanguageName(bookInfo.value.language),
    },
    {
      label: "本の長さ ",
      value: bookInfo.value.printedPageCount
        ? bookInfo.value.printedPageCount + "ページ"
        : "",
    },
  ];
};

const emit = defineEmits(["addBookList"]);
const addBookList = () => {
  emit("addBookList", {
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

onBackupState(() => {
  return {
    date: date.value,
    inputMemo: inputMemo.value,
  };
});

const getHistoryState = () => {
  const historyState = useHistoryState();
  return {
    historyDate: historyState.data?.date || "",
    historyMemo: historyState.data?.inputMemo || "",
  };
};

const convertUrlHttpToHttps = (url: string): string => {
  // URLがhttpから始まる場合にhttpsに書き換える
  if (url && url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
};

const convertHyphenToSlash = (originalDate: string): string => {
  return originalDate.split("-").join("/") || "";
};

const getLanguageName = (languageCode: string): string => {
  try {
    const languageNames = new Intl.DisplayNames(["ja"], { type: "language" });
    return languageNames.of(languageCode) || "";
  } catch (error: any) {
    console.error("Error:", error.message);
    return "";
  }
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-row class="pb-2">
            <v-col cols="4">
              <v-img :src="bookInfo.image" max-height="600px"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title> タイトル：{{ bookInfo.title }} </v-card-title>
              読んだ日：
              <v-menu :closeOnContentClick="false">
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
          <v-divider class="border-opacity-25"></v-divider>
          <BookDetail :bookDetailInfo="bookDetailInfo" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
