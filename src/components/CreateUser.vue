<template>
  <h3> Create User</h3>
  <div class="card flex justify-center">
    <Toast />
    <Form v-slot="$form" :resolver="resolver" :initialValues="{ username: '', email: '' }" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
      <div class="flex flex-col gap-1">
        <InputText name="username" type="text" placeholder="Username" />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="email" type="text" placeholder="Email" />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';

const toast = useToast();
const message = ref('')

// Validation 
const resolver = ref(zodResolver(
    z.object({
        username: z.string().min(1, { message: 'Username is required.' }),
        email: z.string()
              .nonempty({ message: 'Email is required.' })
              .pipe(z.email({ message: 'Invalid email address.' }))
    })
));

// Function triggered on form submit
const onFormSubmit = async ({ valid, values }) => {
    if (valid) {
        try {
            const response = await axios.post('http://localhost:8080/api/users', {
              username: values.username, 
              email: values.email 
              })
            message.value = `User ${response.data.username} created!`
            toast.add({ severity: 'success', summary: message, life: 3000 });
        } catch (err) {
            message.value = 'Error creating user'
            toast.add({ severity: 'error', summary: message, life: 3000 });
        }
    }
  };

</script>