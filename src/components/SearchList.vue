<template>
  <form action="" @submit.prevent="submitFrom">
    <label for="search" class="mr-2">搜尋代辦</label>
    <input
      type="text"
      class="p-1 mr-2 border border-gray-300 rounded-md"
      id="search"
      v-model="searchKey.value"
      :class="{ 'bg-gray-200': searchKey.isValue }"
      @blur="searchKey.isValue = false"
    />

    <base-btn submit mode="list" class="mr-2">搜尋</base-btn>
    <base-btn mode="delete" @click="clearSearch">清除搜尋</base-btn>
  </form>
</template>

<script>
export default {
  emits: ['search-key'],
  data() {
    return {
      searchKey: {
        value: '',
        isValue: false,
      },
    };
  },
  methods: {
    submitFrom() {
      if (this.searchKey.value === '') {
        this.searchKey.isValue = true;
        return;
      }
      this.$emit('search-key', this.searchKey.value);
      this.searchKey.value = '';
    },
    clearSearch() {
      this.searchKey.isValue = false;
      this.$emit('search-key', this.searchKey.value);
    },
  },
};
</script>
