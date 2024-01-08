<script setup lang="ts">
import Footer from "./global/footer.vue";
import Header from "./global/header.vue";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Book } from "./typings/Types";
import { computed } from "vue";
import {
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
const store = useStore();
const FIRESTORE_PATH = "books";
const isAuth = computed(() => !!store.state.auth.user.uid);

onMounted(async () => {
  await fetchBooks();
});

// 本を追加
const addBook = async (book: Book) => {
  const currentSeq = getCurrentSeq();
  const addBook: Book = {
    ...book,
    uid: auth.state.user.uid,
    seq: currentSeq,
  };

  const recordId = `${addBook.uid}-${addBook.seq}`;
  await setDoc(doc(db, FIRESTORE_PATH, recordId), addBook);

  updateBooks([...books.value, addBook]);

  goToIndexPage();
};

// 本を更新
const updateBookInfo = async (book: Book) => {
  const recordId = `${book.uid}-${book.seq}`;
  const bookDocRef = doc(db, FIRESTORE_PATH, recordId);
  await updateDoc(bookDocRef, book);

  const tempBooks = [...books.value];
  const index = tempBooks.findIndex((e) => e.bookId === book.bookId);
  tempBooks[index] = { ...book };
  updateBooks(tempBooks);

  router.push("/");
};

// 本を削除
const deleteBook = async (seq: number) => {
  const book = books.value.find((b) => b.seq === seq);

  if (!book) {
    console.error("Book not found for sequence", seq);
    return;
  }

  const confirmMessage = `${book.title} を削除してもよろしいでしょうか`;

  if (confirm(confirmMessage)) {
    const recordId = `${auth.state.user.uid}-${seq}`;
    await deleteDoc(doc(db, FIRESTORE_PATH, recordId));

    const updatedBooks = books.value.filter((book: Book) => book.seq !== seq);
    updateBooks(updatedBooks);
  }
};

// 本をすべて削除
const deleteBooks = async () => {
  const confirmMessage = "全ての本を削除してもよろしいでしょうか";
  if (confirm(confirmMessage)) {
    const booksData = await getDocs(
      query(collection(db, "books"), where("uid", "==", auth.state.user.uid))
    );

    await Promise.all(
      booksData.docs.map(async (bookDoc) => {
        await deleteDoc(doc(db, FIRESTORE_PATH, bookDoc.id));
      })
    );

    updateBooks([]);
    window.location.reload();
  }
};

// 編集画面に遷移
// const goToEditPage = (id: string) => {
//   router.push({
//     name: "BookEdit",
//     params: { bookId: id },
//   });
// };

// Indexに遷移
const goToIndexPage = () => {
  router.push({
    name: "BookIndex",
  });
};

const fetchBooks = async () => {
  const booksData = await getDocs(
    query(collection(db, "books"), where("uid", "==", auth.state.user.uid))
  );
  const fetchedBooks = booksData.docs.map((doc) => doc.data()) as Book[];
  if (fetchedBooks && fetchedBooks.length > 0) {
    books.value = fetchedBooks;
  }
};

const getCurrentSeq = () => {
  return books.value.length > 0
    ? Math.max(...books.value.map((b) => b.seq || 0)) + 1
    : 1;
};

const updateBooks = (newBooks: Book[]) => {
  books.value = newBooks;
};

// TODO ソート機能を追加する？
</script>

<template>
  <v-app>
    <Header :isAuth="isAuth"></Header>
    <v-main>
      <v-container>
        <router-view
          :isAuth="isAuth"
          :books="books"
          @add-book-list="addBook"
          @update-book-info="updateBookInfo"
          @delete-Book-List="deleteBook"
          @delete-books="deleteBooks"
        />
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style scoped></style>
