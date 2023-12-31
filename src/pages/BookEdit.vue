<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Book } from "../typings/Types";

type Props = {
  books: Book[];
};

const route = useRoute();
const bookId = route.params.bookId as string;

const props = defineProps<Props>();
const book = ref(props.books.find((book) => book.bookId === bookId)!);

const readDate = ref();
const date = ref(
  book.value.readDate ? book.value.readDate : formatDate(new Date())
);

const emit = defineEmits(["update-book-info"]);

const updateBookInfo = () => {
  emit("update-book-info", {
    seq: book.value.seq,
    bookId: bookId,
    title: book.value.title,
    description: book.value.description,
    image: book.value.image,
    readDate: date.value,
    memo: book.value.memo,
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
              <v-img :src="book.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title> タイトル：{{ book.title }} </v-card-title>
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
              感想：<v-textarea class="mx-2" v-model="book.memo"></v-textarea>
              <v-card-actions>
                <v-btn class="bg-secondary" to="/">一覧に戻る</v-btn>
                <v-btn class="bg-info" @click="updateBookInfo">保存する</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
