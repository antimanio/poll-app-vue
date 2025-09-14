<template>
    <Card>
        <template #title>Create Poll</template>
        <template #content>
        <div class="card flex justify-center">
            <Toast />
            <Form v-slot="$form" :resolver="pollResolver" :initialValues="formValuesPoll" @submit="onFormSubmitPoll" class="flex flex-col gap-4 w-full sm:w-56">
                <div>
                    <Select
                        v-model="selectedUser"
                        :options="users"
                        optionLabel="username"   
                        dataKey="id"           
                        placeholder="Select user"
                        class="w-full md:w-56"
                    />
                    <p v-if="!selectedUser" style="color: red">Need to select question</p>
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
    </Card>
     <Card>
        <template #title>Add options</template>
        <template #content>
        <div class="card flex justify-center">
            <Toast />
            <Form v-slot="$form" :resolver="optionsResolver" :initialValues="formValuesOptions" @submit="onFormSubmitOptions" class="flex flex-col gap-4 w-full sm:w-56">
                <div>
                    <Select
                        v-model="selectedQuestion"
                        :options="questions"
                        optionLabel="question"   
                        dataKey="id"           
                        placeholder="Select question"
                        class="w-full md:w-56"
                    />
                    <p v-if="!selectedQuestion" style="color: red">Need to select question</p>
                    <div v-if="selectedQuestion">✅ Selected: {{ selectedQuestion.question }} (ID: {{ selectedQuestion.id }})</div>
                </div>
                <div class="flex flex-col gap-1">
                    <InputText name="caption" type="text" placeholder="Caption" />
                    <Message v-if="$form.caption?.invalid" severity="error" size="small" variant="simple">{{ $form.caption.error?.message }}</Message>
                </div>
                <div class="flex flex-col gap-1">
                    <InputNumber name="order" type="number" placeholder="Order" />
                    <Message v-if="$form.order?.invalid" severity="error" size="small" variant="simple">{{ $form.order.error?.message }}</Message>
                </div>
                <Button type="submit" severity="secondary" label="Submit" />
            </Form>
        </div>
        </template>
    </Card>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';

const BASE_URL = "http://localhost:8080"
const toast = useToast();
const message = ref('');

//user
const selectedUser = ref(null)
const users = ref([])

//poll
const formValuesPoll = ref({
    question: '',
    validUntil: null,
})

const selectedQuestion = ref(null)
const questions = ref([])

const formValuesOptions = ref({
    caption: '',
    order : 0,
})

const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users`)
    users.value = response.data
  } catch (err) {
    message.value = 'Error fetching users'
  }
}

const getQuestions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/polls`)
    questions.value = response.data
  } catch (err) {
    message.value = 'Error fetching polls'
  }
}

// Fetch users and questions when component mounts
onMounted(() => {
    getUsers()
    getQuestions()
})


// Validation poll
const pollResolver = zodResolver(
  z.object({
    question: z.string().min(1, { message: 'Question is required.' }),
    validUntil: z.preprocess((val) => {
      if (val === '' || val === null) return null;
      return new Date(val);
    }, z.union([z.date(), z.null().refine((val) => val !== null, { message: 'Date is required.' })])),
  })
);

// Validation options
const optionsResolver = zodResolver(
  z.object({
    caption: z.string().min(1, { message: 'Caption is required.' }),
    order: z.number(),
  })
);

// Function triggered on form submit
const onFormSubmitPoll = async ({ valid, values }) => {
    if (valid) {
        try {
            const validUntilDate = new Date(values.validUntil)
            const validUntilEpoch = Math.floor(validUntilDate.getTime() / 1000)
            const response = await axios.post(`${BASE_URL}/api/polls`, null, {
                params: {
                    creatorId: selectedUser.value.id,
                    question: values.question,
                    validUntilEpoch: validUntilEpoch
                }
            });

            // the second card has the latest polls, probably better ways to handle this..
            await getQuestions();

            message.value = `Poll for user ${selectedUser.value.id} created!`;
            toast.add({ severity: 'success', summary: message, life: 3000 });
        } catch (err) {
            message.value = `Error creating poll ${err}`;
            toast.add({ severity: 'error', summary: message, life: 3000 });
        }
    }
  };


// Function triggered on form submit
const onFormSubmitOptions = async ({ valid, values }) => {
    if (valid) {
        try {
            console.log(values.caption)
            console.log(values.order)
            const pollId = selectedQuestion.value.id; 
            const response = await axios.post(
                `${BASE_URL}/api/polls/${pollId}/options`,
                null,
                {
                    params: {
                        caption: values.caption, 
                        order: values.order
                    }
                }
            );

            message.value = `Option "${values.caption}" added to poll ${pollId}!`;
            toast.add({ severity: 'success', summary: message.value, life: 3000 });
        } catch (err) {
            message.value = `Error adding option: ${err}`;
            toast.add({ severity: 'error', summary: message.value, life: 3000 });
        }
    }
};

</script>