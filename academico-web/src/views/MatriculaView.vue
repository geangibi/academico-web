<template>
  <div class="max-w-xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-blue-700 mb-4">👥 Matrícula de Aluno em Turma</h2>

    <form @submit.prevent="handleMatricula" class="space-y-4 bg-white p-4 rounded shadow">
      <!-- Turma -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Turma</label>
        <select v-model="turmaId" class="w-full border rounded px-3 py-2">
          <option disabled value="">Selecione uma turma</option>
          <option v-for="turma in turmas" :key="turma.id" :value="turma.id">
            {{ turma.nome }}
          </option>
        </select>
      </div>

      <!-- Aluno -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Aluno</label>
        <select v-model="alunoId" class="w-full border rounded px-3 py-2">
          <option disabled value="">Selecione um aluno</option>
          <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
            {{ aluno.nome }}
          </option>
        </select>
      </div>

      <!-- Botão -->
      <button
        type="submit"
        class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Matricular Aluno
      </button>

      <!-- Mensagem -->
      <p v-if="mensagem" class="text-sm text-center text-green-700 mt-2">{{ mensagem }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listarTurmas, associarAlunoNaTurma } from '../services/turmaService';
import { listarAlunos } from '../services/alunoService';

const turmas = ref([]);
const alunos = ref([]);
const turmaId = ref('');
const alunoId = ref('');
const mensagem = ref('');

async function handleMatricula() {
  try {
    await associarAlunoNaTurma(turmaId.value, alunoId.value);
    mensagem.value = '✅ Aluno matriculado com sucesso!';
    alunoId.value = '';
    turmaId.value = '';
  } catch (err) {
    console.error('Erro ao matricular aluno:', err);
    mensagem.value = '❌ Erro ao matricular aluno na turma';
  }
}

onMounted(async () => {
  try {
    const turmasResponse = await listarTurmas(); 
    turmas.value = turmasResponse;

    const alunosResponse = await listarAlunos(); 
    alunos.value = alunosResponse; 
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  }
});

</script>
