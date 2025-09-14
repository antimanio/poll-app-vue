<template>
    <Card>
        <template #title>Time to vote!</template>
        <template #content>
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
            </div>
            <div v-if="selectedQuestion"  class="card">
                <DataTable :value="votes" tableStyle="min-width: 50rem">
                    <Column field="caption" header="Caption"></Column>
                    <Column field="votes" header="Votes"></Column>
                </DataTable>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
const message = ref('')
const votes = ref([])
const selectedQuestion = ref(null)
const questions = ref([])

const getVotes = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/votes/results/${selectedQuestion.value.id}`)
    console.log(response.data)
    votes.value = response.data
  } catch (err) {
    console.log(err)
    message.value = 'Error fetching users '
  }
}


const getQuestions = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/polls')
    questions.value = response.data
  } catch (err) {
    message.value = 'Error fetching polls'
  }
}

onMounted(() => {
    getQuestions()
});

//add watch for selectedQuestion
watch(selectedQuestion, (newQuestion) => {
  if (newQuestion) {
    getVotes()
  } else {
    votes.value = [] 
  }
})


</script>
