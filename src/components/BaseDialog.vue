<template>
  <teleport to="body">
    <div
      class="fixed top-0 left-0 z-10 w-full h-full overflow-x-hidden bg-black/30"
      v-if="show"
      @click="tryClose"
    ></div>
    <transition name="dialog">
      <div class="dialog top-6" open v-if="show">
        <header class="flex items-center justify-between p-3 bg-red-500">
          <h2 class="text-2xl text-white">{{ title }}</h2>
          <img
            src="@/assets/times-solid.svg"
            alt="close"
            class="w-[20px] hover:scale-150"
            @click="tryClose"
          />
        </header>
        <div class="p-3">
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
  },
  emits: ['close'],
  computed: {},
  methods: {
    tryClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.dialog {
  @apply fixed z-20 p-0 overflow-hidden -translate-x-1/2 bg-white rounded-lg shadow-lg left-1/2;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-active {
  transition: all 0.2s ease-out;
}
.dialog-leave-active {
  transition: all 0.2s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
}
</style>
