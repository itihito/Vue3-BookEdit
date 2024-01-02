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
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase/firebase.ts";
import auth from "./store/auth";

const router = useRouter();
const books = ref<Book[]>([]);
const newBook = ref<string>("");
const store = useStore();
const FIRESTORE_PATH = "books";

onMounted(async () => {
  const q = query(
    collection(db, "books"),
    where("uid", "==", auth.state.user.uid)
  );
  const booksData = await getDocs(q);
  books.value = booksData.docs.map((doc) => doc.data()) as Book[];
});

// 本を追加
const addBook = async (book: Book) => {
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
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
    memo: book.memo,
  };

  const recordId = `${book.uid}-${book.seq}`;
  await setDoc(doc(db, FIRESTORE_PATH, recordId), book);

  books.value.push(addBook);
  newBook.value = "";
  goToEditPage(addBook.bookId);
};

// 本を更新
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
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
    memo: book.memo,
  };

  const recordId = `${updateBook.uid}-${updateBook.seq}`;
  const bookDocRef = doc(db, FIRESTORE_PATH, recordId);
  await updateDoc(bookDocRef, updateBook);

  books.value.splice(startIndex, 1, updateBook);
  router.push("/");
};

// 本を削除
const removeBook = async (seq: number) => {
  const recordId = `${auth.state.user.uid}-${seq}`;
  await deleteDoc(doc(db, FIRESTORE_PATH, recordId));
  books.value = books.value.filter((book: Book) => book.seq !== seq);
};

// 本をすべて削除
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

// 編集画面に遷移
const goToEditPage = (id: string) => {
  router.push(`edit/${id}`);
};

const isAuth = computed(() => {
  return store.state.auth.user.uid ? true : false;
});

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
