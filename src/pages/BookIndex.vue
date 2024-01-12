<script setup lang="ts">
import SortBtn from "../components/SortBtn.vue";
import { Book, BooksProps, SortBookProperties } from "../typings/Types";

const { books, uid } = defineProps<BooksProps>();
const emit = defineEmits(["deleteBookList", "deleteBooks", "sortBooks"]);
const deleteBook = (seq: number) => {
  emit("deleteBookList", seq);
};

const deleteBooks = () => {
  emit("deleteBooks");
};

const sortBookProps: SortBookProperties[] = [
  {
    label: "読書日（新しい順）",
    sortKey: "date",
    order: "asc",
  },
  {
    label: "読書日（古い順）",
    sortKey: "date",
    order: "desc",
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

const sortBooks = (sortKey: keyof Book, order: string): void => {
  emit("sortBooks", sortKey, order);
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" class="mx-auto mt-2 d-flex">
        <v-btn color="primary" to="/search" v-if="uid">検索する</v-btn>
        <v-btn color="primary" to="/login" v-else>ログインする</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="uid && books && books.length > 0"
          class="bg-error mr-8"
          v-on:click="deleteBooks"
          >全ての本を削除する</v-btn
        >
        <SortBtn
          :sort-book-props="sortBookProps"
          :books="books"
          @sort-Books="sortBooks"
        />
      </v-col>
    </v-row>
    <v-row v-if="uid">
      <v-col
        cols="12"
        xl="3"
        lg="4"
        md="6"
        sm="6"
        v-for="book in books"
        :key="book.seq"
      >
        <v-card>
          <v-row class="d-flex justify-center">
            <v-col cols="4">
              <v-img :src="book.image" height="160px"></v-img>
            </v-col>
          </v-row>
          <v-col cols="12">
            <v-card-title class="headline">{{ book.title }}</v-card-title>
            <v-card-subtitle> 読書日：{{ book.date }} </v-card-subtitle>
            <v-card-subtitle> 感想：{{ book.memo }} </v-card-subtitle>
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn
                class="bg-indigo"
                elevation="8"
                icon="mdi-pencil"
                :to="`/edit/${book.bookId}`"
              />
              <v-btn
                class="bg-error ml-4"
                elevation="8"
                icon="mdi-delete"
                v-on:click="deleteBook(book.seq)"
              />
            </v-card-actions>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.headline {
  text-overflow: inherit;
  white-space: unset;
}
.logout-item:hover {
  cursor: pointer;
}
</style>
