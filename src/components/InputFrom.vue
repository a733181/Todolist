<template>
  <form action="" class="flex items-center mb-3" @submit.prevent="submitFrom">
    <label for="addClass" class="mr-2">{{ title }}</label>
    <input
      type="text"
      id="addClass"
      class="p-1 mr-2 border border-gray-300 rounded-md"
      :class="{ 'bg-gray-200': context.isValue }"
      v-model.trim="context.value"
      @blur="context.isValue = false"
    />
    <select
      name=""
      id=""
      class="p-1 mr-2 border rounded-lg"
      v-model="context.group"
      v-if="mode === 'list'"
    >
      <option
        v-for="group in groupList"
        :value="group[0]"
        :key="group[0]"
        :selected="group[1].value === '未分類'"
      >
        {{ group[1].value }}
      </option>
    </select>
    <base-btn :mode="mode" submit>新增</base-btn>
  </form>
</template>

<script>
export default {
  props: ['title', 'mode', 'group-list'],
  emits: ['post-group', 'post-list'],
  data() {
    return {
      context: {
        value: '',
        group: '',
        isValue: false,
      },
    };
  },
  watch: {
    groupList() {
      const group = this.groupList[0][0];
      this.context.group = group;
    },
  },

  methods: {
    async submitFrom() {
      if (this.context.value === '') {
        this.context.isValue = true;
        return;
      }
      if (this.mode === 'group') {
        const url = 'groupList.json';
        const data = {
          url,
          data: {
            value: this.context.value,
          },
        };
        this.$emit('post-group', data);
        this.clearFrom();
      }
      if (this.mode === 'list') {
        const url = `todolist/${this.context.group}.json`;
        const data = {
          url,
          data: {
            value: this.context.value,
            finish: false,
          },
        };
        this.$emit('post-list', data);
        this.clearFrom();
      }
    },
    clearFrom() {
      this.context.value = '';
      const groupItem = this.groupList.filter((item) => item[1].value === '未分類');
      const groupId = groupItem[0][0];
      this.context.group = groupId;
      this.context.isValue = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.btn {
  @apply p-1 text-white rounded-lg;
}
.btn-blue {
  @apply bg-blue-400 hover:bg-blue-600 active:bg-black;
}
.btn-green {
  @apply hover:bg-green-700 active:bg-black bg-green-600;
}
</style>
