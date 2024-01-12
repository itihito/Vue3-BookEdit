<script setup lang="ts">
import Footer from "./global/footer.vue";
import Header from "./global/header.vue";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Book } from "./typings/Types";
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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase/firebase.ts";

const router = useRouter();
const books = ref<Book[]>([]);
const FIRESTORE_PATH = "books";
const store = useStore();
const uid = ref(store.getters["auth/getUid"]);

onMounted(async () => {
  if (uid.value) {
    await fetchBooks();
  }
});

// 本を追加
const addBook = async (book: Book) => {
  const currentSeq = getCurrentSeq();
  const addBook: Book = {
    ...book,
    uid: uid.value,
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
    const recordId = `${uid.value}-${seq}`;
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
      query(collection(db, "books"), where("uid", "==", uid.value))
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

// Indexに遷移
const goToIndexPage = () => {
  router.push({
    name: "BookIndex",
  });
};

const fetchBooks = async () => {
  const booksData = await getDocs(
    query(collection(db, "books"), where("uid", "==", uid.value))
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

// サインイン
const signIn = (email: string, password: string) => {
  // メールアドレスとパスワードが入力されているかを確認

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      await store.dispatch("auth/SetUserStateAction", {
        name: user.displayName,
        uid: user.uid,
        email: user.email,
      });
      uid.value = user.uid;
      await fetchBooks();
      await router.push("/");
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
};

// ユーザー作成
const createUser = async (
  userName: string,
  email: string,
  password: string
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // ユーザーのdisplayNameを設定
      await updateProfile(user, { displayName: userName });

      // 成功時処理
      store.dispatch("auth/SetUserStateAction", {
        name: userName,
        uid: user.uid,
        email: user.email,
      });
      uid.value = user.uid;
      await router.push("/");
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
};

const sortByKey = (sortKey: keyof Book, order: "asc" | "desc") => {
  return (a: Book, b: Book) => {
    const comparison =
      a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
    return order === "asc" ? comparison : -comparison;
  };
};

// keyに基づいてbooksをソート
const sortBooks = (sortKey: keyof Book, order: "asc" | "desc") => {
  let sortedBooks: Book[] = [...books.value];

  switch (sortKey) {
    case "date": // 読書日順
    case "title": // タイトル順
      sortedBooks.sort(sortByKey(sortKey, order));
      break;
    default:
      console.error("Invalid property for sorting");
  }

  updateBooks(sortedBooks);
};
</script>

<template>
  <v-app>
    <Header :uid="uid"></Header>
    <v-main>
      <v-container>
        <router-view
          :uid="uid"
          :books="books"
          @add-book-list="addBook"
          @update-book-info="updateBookInfo"
          @delete-Book-List="deleteBook"
          @delete-books="deleteBooks"
          @sign-in-with-email-and-password="signIn"
          @create-user-with-email-and-password="createUser"
          @sort-books="sortBooks"
        />
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style scoped></style>
