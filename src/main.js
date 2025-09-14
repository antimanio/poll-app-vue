import './assets/main.css'
import router from './router'  

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Card from 'primevue/card';
import { Form } from '@primevue/forms';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; 
import Row from 'primevue/row';                 

import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(router) 
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})
app.use(ToastService);
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Message', Message)
app.component('Form', Form)
app.component('Toast', Toast);
app.component('Select', Select);
app.component('InputNumber', InputNumber);
app.component('DatePicker', DatePicker);
app.component('Card', Card);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.mount('#app')
