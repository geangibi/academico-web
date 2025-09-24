<template>
  <div class="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
    <!-- Título -->
    <h1 class="text-3xl font-extrabold text-blue-700 mb-8 border-b pb-2">📘 Disciplinas</h1>

    <!-- Lista de disciplinas -->
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <li
        v-for="disciplina in disciplinas"
        :key="disciplina.id || disciplina.codigo"
        class="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1"
      >
        <div class="font-semibold text-gray-800 text-lg">{{ disciplina.nome }}</div>
        <div class="text-sm text-gray-500 mt-1">Código: {{ disciplina.codigo }}</div>
      </li>
    </ul>

    <!-- Formulário -->
    <div class="bg-white p-6 rounded-2xl shadow-md">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">➕ Adicionar nova disciplina</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model.trim="form.nome"
          type="text"
          placeholder="Nome da disciplina"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p v-if="errors.nome" class="text-sm text-red-600">{{ errors.nome }}</p>

        <input
          v-model.trim="form.codigo"
          type="text"
          placeholder="Código"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p v-if="errors.codigo" class="text-sm text-red-600">{{ errors.codigo }}</p>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
        >
          {{ submitting ? 'Salvando...' : 'Criar Disciplina' }}
        </button>

        <!-- Mensagens -->
        <p v-if="message" class="text-green-700 bg-green-100 border border-green-200 rounded px-3 py-2 mt-2">
          {{ message }}
        </p>
        <p v-if="serverError" class="text-red-700 bg-red-100 border border-red-200 rounded px-3 py-2 mt-2">
          {{ serverError }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listarDisciplinas, criarDisciplina } from '../services/disciplinaService';

const disciplinas = ref([]);
const form = ref({ nome: '', codigo: '' });
const errors = ref({ nome: '', codigo: '' });
const message = ref('');
const serverError = ref('');
const submitting = ref(false);

function validate() {
  errors.value = { nome: '', codigo: '' };
  let ok = true;

  if (!form.value.nome || form.value.nome.length < 3) {
    errors.value.nome = 'Informe um nome com pelo menos 3 caracteres.';
    ok = false;
  }

  if (!form.value.codigo || form.value.codigo.length < 4) {
    errors.value.codigo = 'Informe um código válido.';
    ok = false;
  }

  return ok;
}

async function handleSubmit() {
  message.value = '';
  serverError.value = '';

  if (!validate()) return;

  submitting.value = true;
  try {
    const created = await criarDisciplina({
      nome: form.value.nome.trim(),
      codigo: form.value.codigo.trim(),
    });
    disciplinas.value.push(created);
    message.value = 'Disciplina criada com sucesso!';
    form.value = { nome: '', codigo: '' };
  } catch (err) {
    serverError.value = err.message || 'Erro ao criar disciplina.';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  try {
    disciplinas.value = await listarDisciplinas();
  } catch (err) {
    serverError.value = 'Erro ao carregar disciplinas.';
  }
});
</script>
