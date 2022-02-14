import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';
// ui
import BaseBtn from './components/BaseBtn.vue';
import BaseDialog from './components/BaseDialog.vue';

const app = createApp(App);

app.component('base-btn', BaseBtn);
app.component('base-dialog', BaseDialog);
app.mount('#app');
