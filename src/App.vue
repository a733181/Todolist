<template>
  <div class="container p-2 mx-auto min-h-[calc(100vh-40px)]">
    <input-from class="mt-2" mode="group" title="新增分類" @post-group="postData"></input-from>
    <input-from
      class="mt-2"
      mode="list"
      title="新增代辦"
      :group-list="groupList"
      @post-list="postData"
    ></input-from>
    <search-list class="mt-2 mb-3" @search-key="searchList"></search-list>
    <draggable
      :list-data="lists"
      @edit-group="editGroup"
      @delete-group="deleteGroup"
      @move-list="moveList"
      @finish-list="finishList"
      @edit-list="editList"
      @delete-list="deleteList"
      :search-key="searchKey"
    ></draggable>
    <base-dialog title="Error" :show="!!error" @close="closeDialog">
      {{ error }}
    </base-dialog>
    <base-loading :show="loading"></base-loading>
  </div>
  <the-footer></the-footer>
</template>

<script>
import axios from 'axios';
import InputFrom from './components/InputFrom.vue';
import SearchList from './components/SearchList.vue';
import Draggable from './components/Draggable.vue';
import BaseLoading from './components/BaseLoading.vue';
import TheFooter from './components/TheFooter.vue';

export default {
  components: {
    InputFrom,
    SearchList,
    Draggable,
    BaseLoading,
    TheFooter,
  },
  data() {
    return {
      url: 'https://to-do-list-demo-2e619-default-rtdb.firebaseio.com/',
      groupList: '',
      lists: [],
      loading: false,
      error: '',
      searchKey: '',
    };
  },
  watch() {},
  methods: {
    async getGroupList() {
      try {
        const res = await axios.get(`${this.url}groupList.json`);

        if (res.data === null) {
          const data = {
            url: 'groupList.json',
            data: {
              value: '未分類',
            },
          };
          this.postData(data);
        }
        if (res.data) {
          const newData = Object.entries(res.data);
          this.groupList = newData;
          this.getData();
        }
      } catch (err) {
        this.error = err.message;
      }
    },
    getData() {
      this.lists = [];
      this.groupList.forEach((list) => {
        const get = {
          url: `${this.url}todolist/${list[0]}.json`,
          id: list[0],
          name: list[1].value,
        };
        this.getDataList(get);
      });
    },

    async getDataList(get) {
      try {
        this.loading = true;
        const res = await axios.get(get.url);
        const newData = [];
        if (res.data) {
          const resData = Object.entries(res.data);
          resData.forEach((data) => {
            const list = {
              id: data[0],
              value: data[1],
            };
            newData.push(list);
          });
        }
        const listData = {
          id: get.id,
          name: get.name,
          value: [...newData],
        };
        this.lists.push(listData);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async postData(itemData) {
      try {
        const { url, data } = itemData;
        const newUrl = `${this.url}${url}`;
        await axios.post(newUrl, data);
        if (url.includes('groupList')) {
          this.getGroupList();
        } else {
          this.getData();
        }
      } catch (err) {
        this.error = err.message;
      }
    },
    async putData(item) {
      try {
        await axios.put(item.url, item.data);
      } catch (err) {
        this.error = err.message;
      }
    },
    async delete(item) {
      try {
        await axios.delete(item);
      } catch (err) {
        this.error = err.message;
      }
    },
    editGroup(item) {
      const { name: value } = item;
      const data = {
        url: `${this.url}groupList/${item.id}.json`,
        data: {
          value,
        },
      };
      this.putData(data);
    },
    async deleteGroup(item) {
      this.loading = true;
      const groupUrl = `${this.url}groupList/${item}.json`;
      const listUrl = `${this.url}todolist/${item}.json`;

      await this.delete(groupUrl);
      await this.getGroupList();
      await this.delete(listUrl);
      await this.getData();
      this.loading = false;
    },
    async moveList(changeId) {
      this.loading = true;
      const { listId, groupOldId, groupNewId } = changeId;

      const groupOldIndex = this.lists.findIndex((item) => item.id === groupOldId);
      const [listData] = this.lists[groupOldIndex].value.filter((item) => item.id === listId);

      const { value } = listData;
      const change = {
        url: `${this.url}todolist/${groupNewId}/${listId}.json`,
        data: value,
      };
      await this.putData(change);
      const deleteList = `${this.url}todolist/${groupOldId}/${listId}.json`;
      await this.delete(deleteList);
      await this.getData();
      this.loading = false;
    },
    finishList(item) {
      const { value } = item.item;
      value.finish = !value.finish;
      const change = {
        url: `${this.url}todolist/${item.groupId}/${item.item.id}.json`,
        data: value,
      };
      this.putData(change);
    },
    editList(item) {
      const { value } = item.item;
      const edit = {
        url: `${this.url}todolist/${item.groupId}/${item.item.id}.json`,
        data: value,
      };
      this.putData(edit);
    },
    async deleteList(item) {
      this.loading = true;
      const deleteList = `${this.url}todolist/${item.groupId}/${item.listId}.json`;
      await this.delete(deleteList);
      await this.getData();
      this.loading = false;
    },
    closeDialog() {
      this.error = '';
    },
    searchList(item) {
      this.searchKey = item;
    },
  },
  mounted() {
    this.getGroupList();
  },
};
</script>
