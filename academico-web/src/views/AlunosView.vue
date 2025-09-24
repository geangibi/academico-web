<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Título -->
    <h1 class="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
      👩‍🎓 Alunos
    </h1>

    <!-- Formulário -->
    <form
      @submit.prevent="handleSubmit"
      class="bg-white p-6 rounded-xl shadow-md space-y-5 mb-8"
    >
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
        <input
          v-model.trim="form.nome"
          type="text"
          placeholder="João Silva"
          class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p v-if="errors.nome" class="text-sm text-red-600 mt-1">{{ errors.nome }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Matrícula</label>
        <input
          v-model.trim="form.matricula"
          type="text"
          inputmode="numeric"
          placeholder="2025001"
          class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p v-if="errors.matricula" class="text-sm text-red-600 mt-1">{{ errors.matricula }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">CPF</label>
        <input
          v-model="form.cpf"
          @input="onCpfInput"
          type="text"
          placeholder="000.000.000-00"
          maxlength="14"
          class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p v-if="errors.cpf" class="text-sm text-red-600 mt-1">{{ errors.cpf }}</p>
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
      >
        {{ submitting ? 'Salvando...' : 'Criar Aluno' }}
      </button>

      <!-- Mensagens -->
      <p
        v-if="message"
        class="text-green-700 bg-green-100 border border-green-200 rounded px-3 py-2 mt-2"
      >
        {{ message }}
      </p>
      <p
        v-if="serverError"
        class="text-red-700 bg-red-100 border border-red-200 rounded px-3 py-2 mt-2"
      >
        {{ serverError }}
      </p>
    </form>

    <!-- Lista de alunos -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Lista de Alunos</h2>
    <ul class="space-y-4">
      <li
        v-for="aluno in alunos"
        :key="aluno.id || aluno.matricula"
        class="bg-white p-4 rounded-xl shadow flex items-center justify-between transition hover:shadow-lg"
      >
        <div>
          <div class="font-semibold text-gray-900 text-lg">{{ aluno.nome }}</div>
          <div class="text-sm text-gray-500">
            Matrícula: {{ aluno.matricula }} • CPF: {{ aluno.cpf }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listarAlunos, criarAluno } from '../services/alunoService';

// estado
const alunos = ref([]);
const submitting = ref(false);
const message = ref('');
const serverError = ref('');

// formulário
const form = ref({
  nome: '',
  matricula: '',
  cpf: '',
});

// erros de validação
const errors = ref({
  nome: '',
  matricula: '',
  cpf: '',
});

// máscara + normalização do CPF
function onCpfInput(e) {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
  let masked = '';
  if (digits.length > 0) masked = digits.slice(0, 3);
  if (digits.length > 3) masked += '.' + digits.slice(3, 6);
  if (digits.length > 6) masked += '.' + digits.slice(6, 9);
  if (digits.length > 9) masked += '-' + digits.slice(9, 11);
  form.value.cpf = masked;
}

// validação simples
function validate() {
  errors.value = { nome: '', matricula: '', cpf: '' };
  let ok = true;

  if (!form.value.nome || form.value.nome.length < 3) {
    errors.value.nome = 'Informe um nome com pelo menos 3 caracteres.';
    ok = false;
  }

  if (!/^\d{4,}$/.test(form.value.matricula)) {
    errors.value.matricula = 'Matrícula deve conter apenas números (mínimo 4).';
    ok = false;
  }

  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.value.cpf)) {
    errors.value.cpf = 'CPF deve estar no formato 000.000.000-00.';
    ok = false;
  }

  return ok;
}

// submit
async function handleSubmit() {
  message.value = '';
  serverError.value = '';

  if (!validate()) return;

  submitting.value = true;
  try {
    const payload = {
      nome: form.value.nome.trim(),
      matricula: form.value.matricula.trim(),
      cpf: form.value.cpf.trim(),
    };
    const created = await criarAluno(payload);
    alunos.value.push(created);
    message.value = 'Aluno criado com sucesso!';
    form.value = { nome: '', matricula: '', cpf: '' };
  } catch (err) {
    serverError.value = err.message || 'Erro ao criar aluno.';
  } finally {
    submitting.value = false;
  }
}

// carregar lista
onMounted(async () => {
  try {
    alunos.value = await listarAlunos();
  } catch (err) {
    serverError.value = 'Erro ao carregar alunos.';
  }
});
</script>
