<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Book, BookDetailInfo, BooksProps } from "../typings/Types";
import { getDocs, collection, where, query, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useHistoryState, onBackupState } from "vue-history-state";
import BookDetail from "../components/bookDetail.vue";

const { uid } = defineProps<BooksProps>();
const route = useRoute();
const bookId = route.params.bookId as string;
const inputDate = ref<string | null>();
const date = ref<string>("");
const inputMemo = ref<string>("");
const bookInfo = ref<Book>();
let bookDetailInfo = ref<BookDetailInfo[]>([]);

const emit = defineEmits(["updateBookInfo"]);

onMounted(async () => {
  const { historyDate, historyMemo } = getHistoryState();
  await fetchBook(historyDate, historyMemo);
  setBookDetailInfo();
});

const getHistoryState = () => {
  const historyState = useHistoryState();
  return {
    historyDate: historyState.data?.date || "",
    historyMemo: historyState.data?.inputMemo || "",
  };
};

const fetchBook = async (historyDate?: string, historyMemo?: string) => {
  const bookData = await getDocs(
    query(
      collection(db, "books"),
      where("uid", "==", uid),
      where("bookId", "==", bookId),
      limit(1)
    )
  );
  const fetchedBook = bookData.docs.map((doc) => doc.data())[0] as Book;
  if (fetchedBook) {
    bookInfo.value = fetchedBook;
    date.value = historyDate || fetchedBook.date;
    inputMemo.value = historyMemo || fetchedBook.memo;
  }
};

const setBookDetailInfo = () => {
  bookDetailInfo.value = [
    {
      label: "著者 ",
      value: bookInfo.value?.author || "",
    },
    {
      label: "出版社 ",
      value: bookInfo.value?.publisher || "",
    },
    {
      label: "発売日",
      value: bookInfo.value?.publishedDate
        ? convertHyphenToSlash(bookInfo.value?.publishedDate)
        : "",
    },
    {
      label: "言語 ",
      value: bookInfo.value?.language
        ? getLanguageName(bookInfo.value?.language)
        : "",
    },
    {
      label: "本の長さ ",
      value: bookInfo.value?.printedPageCount
        ? bookInfo.value?.printedPageCount + "ページ"
        : "",
    },
  ];
};

const updateBookInfo = () => {
  if (bookInfo.value && date.value) {
    const updateBook = {
      ...bookInfo.value,
      date: date.value,
      memo: inputMemo.value,
      updatedAt: new Date().toISOString(),
    } as Book;

    emit("updateBookInfo", updateBook);
  }
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
    const formattedDate = formatDate(new Date(inputDate.value));
    date.value = formattedDate;
  }
};

onBackupState(() => {
  return {
    date: date.value,
    inputMemo: inputMemo.value,
  };
});

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
              <v-img :src="bookInfo?.image" max-height="600px"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title> タイトル：{{ bookInfo?.title }} </v-card-title>
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
                <v-btn class="bg-secondary" to="/">一覧に戻る</v-btn>
                <v-btn class="bg-info" @click="updateBookInfo">更新する</v-btn>
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
