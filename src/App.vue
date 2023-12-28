<script setup lang="ts">
import Footer from "./global/footer.vue";
import Header from "./global/header.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

export type Book = {
  id: number | null;
  title: string;
  description: string;
  image: string;
  readDate: string | null;
  memo: string | null;
};
const books = ref<Book[]>([]);
const newBook = ref<string>("");
const STORAGE_KEY = "books";

onMounted(() => {
  if (localStorage.getItem(STORAGE_KEY)) {
    try {
      books.value = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
});

const addBook = (book: Book) => {
  books.value.push({
    id: books.value.length,
    title: book.title,
    description: book.description,
    image: book.image,
    readDate: "",
    memo: "",
  });
  newBook.value = "";
  saveBooks();
  const pageId = books.value.slice(-1)[0].id as number;
  goToEditPage(pageId);
};

const removeBook = (x: number) => {
  books.value.splice(x, 1);
  saveBooks();
};

const saveBooks = () => {
  const parsed = JSON.stringify(books.value);
  localStorage.setItem(STORAGE_KEY, parsed);
};

const updateBookInfo = (book: Book) => {
  const bookId = book.id!;

  const updateInfo = {
    id: bookId,
    readDate: book.readDate,
    memo: book.memo,
    title: books.value[bookId].title,
    image: books.value[bookId].image,
    description: books.value[bookId].description,
  };

  books.value.splice(bookId, 1, updateInfo);
  saveBooks();
  router.push("/");
};

const goToEditPage = (id: number) => {
  router.push(`edit/${id}`);
};

const deleteLocalStorage = () => {
  const isDeleted = "localStorageのデータを削除してもよろしいでしょうか";
  if (confirm(isDeleted)) {
    localStorage.setItem(STORAGE_KEY, "");
    localStorage.removeItem(STORAGE_KEY);
    books.value = [];
    window.location.reload();
  }
};
</script>

<template>
  <!-- <BookSearch /> -->
  <!-- <LocalStorage />
  <LocalStorage2 /> -->
  <v-app>
    <Header @delete-local-storage="deleteLocalStorage"></Header>
    <v-main>
      <v-container>
        <router-view
          :books="books"
          @add-book-list="addBook"
          @update-book-info="updateBookInfo"
        />
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style scoped></style>
