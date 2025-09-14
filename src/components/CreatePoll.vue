<template>
  <div class="card flex justify-center">
    <Toast />
    <Form v-slot="$form" :resolver="resolver" :initialValues="formValues" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
        <div>
            <Select
                v-model="selectedUser"
                :options="users"
                optionLabel="username"   
                dataKey="id"           
                placeholder="Select user"
                class="w-full md:w-56"
            />
            <p v-if="!selectedUser" style="color: red">Need to select user</p>
            <div v-if="selectedUser">✅ Selected: {{ selectedUser.username }} (ID: {{ selectedUser.id }})</div>
        </div>
        <div class="flex flex-col gap-1">
            <InputText name="question" type="text" placeholder="Question" />
            <Message v-if="$form.question?.invalid" severity="error" size="small" variant="simple">{{ $form.question.error?.message }}</Message>
        </div>
        <div class="flex flex-col gap-1">
            <DatePicker name="validUntil"  placeholder="Valid until" fluid />
            <Message v-if="$form.validUntil?.invalid" severity="error" size="small" variant="simple">{{ $form.validUntil.error?.message }}</Message>
        </div>
        <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';

const toast = useToast();
const message = ref('');
const selectedUser = ref(null)
const users = ref([])
const formValues = ref({
    question: '',
    validUntil: null,
})

const getUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/users')
    users.value = response.data
  } catch (err) {
    message.value = 'Error fetching users'
  }
}

// Fetch users when component mounts
onMounted(() => {
  getUsers()
})


// Validation 
const resolver = ref(zodResolver(
    z.object({
        question: z.string().min(1, { message: 'Question is required.' }),
        validUntil: z.preprocess((val) => {
            if (val === '' || val === null) {
                return null;
            }
            return new Date(val);
        }, z.union([z.date(), z.null().refine((val) => val !== null, { message: 'Date is required.' })]))
    })
));

// Function triggered on form submit
const onFormSubmit = async ({ valid, values }) => {
    if (valid) {
        try {
            const validUntilDate = new Date(values.validUntil)
            const validUntilEpoch = Math.floor(validUntilDate.getTime() / 1000)
            const response = await axios.post('http://localhost:8080/api/polls', null, {
                params: {
                    creatorId: selectedUser.value.id,
                    question: values.question,
                    validUntilEpoch: validUntilEpoch
                }
            });
            message.value = `Poll for user ${selectedUser.value.id} created!`;
            toast.add({ severity: 'success', summary: message, life: 3000 });
        } catch (err) {
            message.value = `Error creating poll ${err}`;
            toast.add({ severity: 'error', summary: message, life: 3000 });
        }
    }
  };
</script>