<script setup lang="ts">
import { useStore } from "vuex";
import { Book } from "../Types";
import { computed } from "vue";

type Props = {
  books: Book[];
};

defineProps<Props>();
const emit = defineEmits(["deleteBookList"]);
const deleteBook = (seq: number) => {
  emit("deleteBookList", seq);
};

const store = useStore();
const auth = computed(() => {
  return store.state.auth.user;
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-btn color="primary" to="/search" v-if="auth.uid">検索する</v-btn>
        <v-btn color="primary" to="/login" v-else>ログインする</v-btn>
      </v-col>
    </v-row>
    <v-row>
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
          <v-row>
            <v-col cols="4">
              <v-img :src="book.image"></v-img>
            </v-col>
          </v-row>
          <v-col cols="8">
            <v-card-title>{{ book.title }}</v-card-title>
            読んだ日：{{ book.readDate }} 感想：{{ book.memo }}
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

<style scoped></style>
