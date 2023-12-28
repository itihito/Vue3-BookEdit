<script setup lang="ts">
const emit = defineEmits(["delete-local-storage"]);
const deleteLocalStorage = () => {
  emit("delete-local-storage");
};
</script>

<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
      <v-btn class="bg-error" color="" v-on:click="deleteLocalStorage"
        >すべて削除する</v-btn
      >
    </v-app-bar>
  </div>
</template>

<style lang="css" scoped></style>
