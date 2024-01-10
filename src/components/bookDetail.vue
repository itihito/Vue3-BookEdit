<script setup lang="ts">
import { BookDetailProps } from "../typings/Types";

const { bookDetailInfo } = defineProps<BookDetailProps>();
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="pb-0">書籍情報</v-card-title>
        <v-list class="py-0 v-List">
          <v-list-item
            v-for="bookInfo in bookDetailInfo"
            :key="bookInfo.label"
            class="py-0"
            min-height="2rem"
          >
            <v-list-item-title style="display: inline; font-weight: bold">
              {{ bookInfo.label }} :
            </v-list-item-title>
            <v-list-item-subtitle style="display: inline; opacity: 1">
              {{ bookInfo.value }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-List {
  margin-left: 18px;
}
</style>
