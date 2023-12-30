<script setup lang="ts">
import Footer from "./global/footer.vue";
import Header from "./global/header.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Book, SearchResultBook } from "./Types";

const router = useRouter();
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

const addBook = (book: SearchResultBook) => {
  const currentSeq =
    books.value.length > 0
      ? Math.max(...books.value.map((b) => b.seq || 0)) + 1
      : 1;

  books.value.push({
    seq: currentSeq,
    bookId: book.bookId,
    title: book.title,
    description: book.description,
    image: book.image,
    readDate: "",
    memo: "",
  });
  newBook.value = "";
  saveBooks();
  const pageId = books.value.slice(-1)[0].bookId;
  goToEditPage(pageId);
};

const removeBook = (seq: number) => {
  books.value = books.value.filter((book: Book) => book.seq !== seq);
  saveBooks();
};

const saveBooks = () => {
  const parsed = JSON.stringify(books.value);
  localStorage.setItem(STORAGE_KEY, parsed);
};

const updateBookInfo = (book: Book) => {
  const startIndex = books.value.findIndex(
    (book) => book.bookId === book.bookId
  );
  const updateInfo = {
    seq: book.seq,
    bookId: book.bookId,
    title: book.title,
    description: book.description,
    image: book.image,
    readDate: book.readDate,
    memo: book.memo,
  };

  books.value.splice(startIndex, 1, updateInfo);
  saveBooks();
  router.push("/");
};

const goToEditPage = (id: string) => {
  router.push(`edit/${id}`);
};

const deleteLocalStorage = async () => {
  const isDeleted = "localStorageのデータを削除してもよろしいでしょうか";
  if (confirm(isDeleted)) {
    localStorage.setItem(STORAGE_KEY, "");
    localStorage.removeItem(STORAGE_KEY);
    books.value = [];
    await router.push("/");
    window.location.reload();
  }
};

// TODO ソート機能を追加する？
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
          @delete-Book-List="removeBook"
        />
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style scoped></style>
