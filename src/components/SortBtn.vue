<script setup lang="ts">
import type {
  Book,
  SearchResultBook,
  SortBookProperties,
  SortSearchResultBookProperties,
  GoogleBooksApiOrderBy,
} from "../typings/Types";

type Props = {
  sortBookProps: SortBookProperties[] | SortSearchResultBookProperties[];
  books: Book[] | SearchResultBook[];
};

const { sortBookProps, books } = defineProps<Props>();
const emit = defineEmits(["sort-books"]);
const sortBooks = (
  sortKey: keyof Book | GoogleBooksApiOrderBy,
  order: string
) => {
  emit("sort-books", sortKey, order);
};
</script>

<template>
  <v-menu v-if="books && books.length > 0">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props"> 並び替える </v-btn>
    </template>

    <v-list>
      <v-list-item
        class="logout-item"
        v-for="(bookProp, index) in sortBookProps"
        :key="index"
      >
        <v-list-item-title
          class="sort-item"
          @click="sortBooks(bookProp.sortKey, bookProp.order)"
          >{{ bookProp.label }}</v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
.sort-item:hover {
  cursor: pointer;
}
</style>
