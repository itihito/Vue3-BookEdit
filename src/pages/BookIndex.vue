<script setup lang="ts">
import { Book } from "../App.vue";

type Props = {
  books: Book[];
};

defineProps<Props>();
</script>

<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-btn color="primary" to="/search">検索する</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" v-for="book in books" :key="book.seq">
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
                :to="`/edit/${book.seq}`"
              />
            </v-card-actions>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
