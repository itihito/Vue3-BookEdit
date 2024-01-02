<script setup lang="ts">
import Footer from "./global/footer.vue";
import Header from "./global/header.vue";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Book } from "./typings/Types";
import { computed } from "vue";
import {
  addDoc,
  getDocs,
  updateDoc,
  collection,
  where,
  query,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase/firebase.ts";
import auth from "./store/auth";

const router = useRouter();
const books = ref<Book[]>([]);
const newBook = ref<string>("");
const store = useStore();

onMounted(async () => {
  const q = query(
    collection(db, "books"),
    where("uid", "==", auth.state.user.uid)
  );
  const booksData = await getDocs(q);
  books.value = booksData.docs.map((doc) => doc.data()) as Book[];
});

const addBook = (book: Book) => {
  const currentSeq =
    books.value.length > 0
      ? Math.max(...books.value.map((b) => b.seq || 0)) + 1
      : 1;
  const addBook: Book = {
    uid: auth.state.user.uid,
    seq: currentSeq,
    bookId: book.bookId,
    title: book.title,
    description: book.description,
    image: book.image,
    date: book.date,
    dateTime: book.dateTime,
    memo: book.memo,
  };

  books.value.push(addBook);
  addBookToFirestore(addBook);
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
  // localStorage.setItem(STORAGE_KEY, parsed);
};

const updateBookInfo = async (book: Book) => {
  const startIndex = books.value.findIndex(
    (book) => book.bookId === book.bookId
  );
  const updateBook: Book = {
    uid: auth.state.user.uid,
    seq: book.seq,
    bookId: book.bookId,
    title: book.title,
    description: book.description,
    image: book.image,
    date: book.date,
    dateTime: book.dateTime,
    memo: book.memo,
  };

  // const res = await updateDoc();

  books.value.splice(startIndex, 1, updateBook);
  saveBooks();
  router.push("/");
};

const goToEditPage = (id: string) => {
  router.push(`edit/${id}`);
};

const deleteLocalStorage = async () => {
  const isDeleted = "localStorageのデータを削除してもよろしいでしょうか";
  if (confirm(isDeleted)) {
    // localStorage.setItem(STORAGE_KEY, "");
    // localStorage.removeItem(STORAGE_KEY);
    books.value = [];
    await router.push("/");
    window.location.reload();
  }
};

const isAuth = computed(() => {
  return store.state.auth.user.uid ? true : false;
});

const FIRESTORE_PATH = "books";
const addBookToFirestore = async (book: Book) => {
  const recordId = `${book.uid}-${book.seq}`;
  await setDoc(doc(db, FIRESTORE_PATH, recordId), book);
};

// TODO ソート機能を追加する？
</script>

<template>
  <!-- <BookSearch /> -->
  <!-- <LocalStorage />
  <LocalStorage2 /> -->
  <v-app>
    <Header :isAuth="isAuth"></Header>
    <v-main>
      <v-container>
        <router-view
          :isAuth="isAuth"
          :books="books"
          @add-book-list="addBook"
          @update-book-info="updateBookInfo"
          @delete-Book-List="removeBook"
          @delete-local-storage="deleteLocalStorage"
        />
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style scoped></style>
