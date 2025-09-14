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
                    <Column header="Upvote">
                      <template #body="slotProps">
                        <Button @click="handleVote(true, slotProps.data, slotProps.index)">upvote</Button>
                      </template>
                    </Column>
                    <Column header="Downvote">
                      <template #body="slotProps">
                        <Button @click="handleVote(false, slotProps.data, slotProps.index)">downvote</Button>
                      </template>
                    </Column>
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

const handleVote = async (upvote, row, optionIndex) => {
  try {
    const pollId = selectedQuestion.value.id
    let url = ""
    if (upvote){
      url = "http://localhost:8080/api/votes/upvote"

    } else {
      url = "http://localhost:8080/api/votes/downvote"
    }
    console.log('options row index', optionIndex)
    const response = await axios.post(url, null, {
      params: {
        userId: 1,
        pollId: pollId,
        optionIndex: optionIndex
      }
    })
    console.log('Vote cast successfully', response.data)
    await getVotes(selectedQuestion.value.id)
  } catch (err) {
    console.error('Error casting vote:', err)
  }
}

// Can only cast one vote lmfao... per user
const getVotes = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/votes/results/${id}`)
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
    getVotes(selectedQuestion.value.id)
  } else {
    votes.value = [] 
  }
})


</script>
