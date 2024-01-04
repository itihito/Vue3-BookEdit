<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Book } from "../typings/Types";
import { getDocs, collection, where, query, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";
import auth from "../store/auth";
import { useHistoryState, onBackupState } from "vue-history-state";

const route = useRoute();
const bookId = route.params.bookId as string;
const book = ref<Book | null>();

const inputDate = ref<string | null>();
const date = ref<string | null>();
const inputMemo = ref<string>("");

const emit = defineEmits(["update-book-info"]);

onMounted(async () => {
  const { historyDate, historyMemo } = getHistoryState();
  await fetchBook(historyDate, historyMemo);
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
      where("uid", "==", auth.state.user.uid),
      where("bookId", "==", bookId),
      limit(1)
    )
  );
  const fetchedBook = bookData.docs.map((doc) => doc.data())[0] as Book;
  if (fetchedBook) {
    book.value = fetchedBook;
    date.value = historyDate ? historyDate : fetchedBook.date;
    inputMemo.value = historyMemo ? historyMemo : fetchedBook.memo;
  }
};

const updateBookInfo = () => {
  if (book.value && date.value) {
    const updateBook = {
      ...book.value,
      date: date.value,
      memo: inputMemo.value,
      updatedAt: new Date().toISOString(),
    } as Book;

    emit("update-book-info", updateBook);
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
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-row>
            <v-col cols="4">
              <v-img :src="book?.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title> タイトル：{{ book?.title }} </v-card-title>
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
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
