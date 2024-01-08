<script setup lang="ts">
import { useStore } from "vuex";
import { Book } from "../typings/Types";
import { computed } from "vue";

type Props = {
  books: Book[];
};

const { books } = defineProps<Props>();
const emit = defineEmits(["deleteBookList", "delete-local-storage"]);
const deleteBook = (seq: number) => {
  emit("deleteBookList", seq);
};

const store = useStore();
const auth = computed(() => {
  return store.state.auth.user;
});

const deleteLocalStorage = () => {
  emit("delete-local-storage");
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" class="mx-auto mt-2 d-flex justify-space-between">
        <v-btn color="primary" to="/search" v-if="auth.uid">検索する</v-btn>
        <v-btn color="primary" to="/login" v-else>ログインする</v-btn>
        <v-btn
          v-if="books && books.length > 0"
          class="bg-error ml-4"
          color=""
          v-on:click="deleteLocalStorage"
          >全ての本を削除する</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="auth.uid">
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
</style>
