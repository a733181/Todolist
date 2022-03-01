<template>
  <button class="btn" :class="classMode" :type="submit ? null : 'button'">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
    },
    submit: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    classMode() {
      if (this.mode === 'group') {
        return 'btn-blue';
      }
      if (this.mode === 'list') {
        return 'btn-green';
      }
      if (this.mode === 'delete') {
        return 'btn-outline-red';
      }
      return 'btn-outline-green';
    },
  },
};
</script>

<style lang="postcss" scoped>
.btn {
  @apply py-2 px-3 text-white rounded-lg;
}
.btn-blue {
  @apply bg-blue-400 hover:bg-blue-600 active:bg-black;
}
.btn-green {
  @apply hover:bg-green-700 active:bg-black bg-green-600;
}
.btn-outline-green {
  @apply border border-green-600 text-black
hover:bg-green-600 hover:text-white active:text-black;
}
.btn-outline-red {
  @apply border border-red-600 text-black hover:bg-red-600 hover:text-white active:text-black;
}
</style>
