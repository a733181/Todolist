<template>
  <div class="flex flex-col items-center mb-2 lg:flex-wrap lg:flex-row gap-7 lg:items-start">
    <div v-for="list in lists" :key="list.id">
      <div class="flex items-center justify-between h-[50px] mb-2">
        <p v-if="list.id !== cache.id">{{ list.name }}</p>
        <input
          type="text"
          name=""
          v-model="cache.name"
          class="flex-1 p-1 border"
          v-if="list.id === cache.id"
          @blur="editGroup"
        />
        <div v-if="list.name !== '未分類'" class="ml-2">
          <base-btn @click="tryEditGroup(list)" class="mr-2">修改</base-btn>
          <base-btn @click="tryDeleteGroup(list.id)" mode="delete">刪除</base-btn>
        </div>
      </div>
      <draggable
        group="todolist"
        tag="ul"
        class="p-3 mb-10 bg-gray-200 rounded-md"
        @end="moveList"
        :data-id="list.id"
      >
        <li
          v-for="item in list.value"
          :key="item.id"
          :data-id="item.id"
          class="mb-2 w-[350px] flex justify-between items-center"
        >
          <div class="flex-1">
            <input
              type="checkbox"
              class="mr-2"
              :checked="item.value.finish"
              @click="isFinishList(item, list.id)"
            />
            <span
              class="mr-2"
              :class="{ 'line-through': item.value.finish }"
              v-if="item.id !== cache.id"
            >
              {{ item.value.value }}
            </span>
            <input
              type="text"
              name=""
              v-model="cache.value.value"
              class="p-1 mr-2"
              :class="{ 'line-through': item.value.finish }"
              v-if="item.id === cache.id"
              @blur="editList(list.id)"
            />
          </div>
          <div>
            <base-btn class="mr-2" @click="tryEditList(item)" v-if="!item.value.finish"
              >修改</base-btn
            >
            <base-btn @click="deleteList(item.id, list.id)" mode="delete">刪除</base-btn>
          </div>
        </li>
        <p>
          總共 {{ list.countAll }} 筆 / 已完成 {{ list.isFinish }} 筆 / 未完成
          {{ list.noFinish }} 筆
        </p>
      </draggable>
    </div>
  </div>
  <base-dialog title="刪除後無法回覆" :show="showDialog" @close="closeDialog">
    <p class="text-lg">分類內的代辦事項會一併刪除，確認是否刪除</p>
    <div class="flex p-2">
      <base-btn @click="closeDialog" class="w-full mr-2">否</base-btn>
      <base-btn mode="delete" @click="deleteGroup" class="w-full">是</base-btn>
    </div>
  </base-dialog>
</template>
<script>
import { defineComponent } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';

export default defineComponent({
  props: ['list-data', 'search-key'],
  components: {
    draggable: VueDraggableNext,
  },
  emits: ['move-list', 'finish-list', 'edit-list', 'delete-list', 'edit-group', 'delete-group'],
  data() {
    return {
      cache: '',
      showDialog: false,
      deleteGroupId: '',
    };
  },
  computed: {
    lists() {
      let list = '';
      if (this.searchKey) {
        list = this.searchList(this.listData);
      } else {
        list = this.listData;
      }
      const newList = this.countList(list);
      newList.sort((itemA, itemB) => {
        if (itemA.name < itemB.name) {
          return -1;
        }
        return 1;
      });

      return newList;
    },
  },
  methods: {
    searchList(data) {
      return data.map((item) => {
        const newData = item.value.filter((list) => list.value.value.includes(this.searchKey));
        const group = {
          id: item.id,
          name: item.name,
          value: [...newData],
        };
        return group;
      });
    },
    countList(data) {
      return data.map((item) => {
        const isFinish = item.value.filter((list) => list.value.finish === true);
        const noFinish = item.value.filter((list) => list.value.finish === false);
        const newData = {
          id: item.id,
          name: item.name,
          countAll: item.value.length,
          isFinish: isFinish.length,
          noFinish: noFinish.length,
          value: [...item.value],
        };
        return newData;
      });
    },
    moveList(event) {
      this.cache = '';
      const groupOldId = event.from.dataset.id;
      const groupNewId = event.to.dataset.id;

      if (groupOldId !== groupNewId) {
        const changeId = {
          listId: event.clone.dataset.id,
          groupOldId,
          groupNewId,
        };
        this.$emit('move-list', changeId);
      }
    },
    tryEditGroup(item) {
      this.cache = item;
    },
    editGroup() {
      this.$emit('edit-group', this.cache);
      this.cache = '';
    },
    tryDeleteGroup(item) {
      this.showDialog = true;
      this.deleteGroupId = item;
    },
    deleteGroup() {
      this.showDialog = false;
      this.$emit('delete-group', this.deleteGroupId);
      this.deleteGroupId = '';
    },
    isFinishList(item, groupId) {
      const data = {
        groupId,
        item,
      };
      this.$emit('finish-list', data);
    },
    tryEditList(item) {
      this.cache = item;
    },
    editList(groupId) {
      if (this.cache) {
        const data = {
          groupId,
          item: this.cache,
        };
        this.$emit('edit-list', data);
        this.cache = '';
      }
    },
    deleteList(listId, groupId) {
      const data = {
        groupId,
        listId,
      };
      this.$emit('delete-list', data);
    },
    closeDialog() {
      this.showDialog = false;
    },
  },
  mounted() {},
});
</script>
