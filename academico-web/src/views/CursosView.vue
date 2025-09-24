<template>
  <div class="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
    <!-- Título -->
    <h2 class="text-3xl font-extrabold text-blue-700 mb-8 border-b pb-2">📚 Cursos</h2>

    <!-- Lista de cursos -->
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <li
        v-for="curso in cursos"
        :key="curso.id"
        class="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1"
      >
        <strong class="text-lg font-semibold text-gray-800">{{ curso.nome }}</strong>
        <p class="text-sm text-gray-500 mt-1">
          Código: <span class="font-medium">{{ curso.codigo }}</span> — 
          {{ curso.cargaHorariaTotal }}h
        </p>
      </li>
    </ul>

    <!-- Formulário de novo curso -->
    <div class="bg-white p-6 rounded-2xl shadow-md">
      <h3 class="text-2xl font-semibold text-gray-700 mb-4">➕ Adicionar novo curso</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="novoCurso.nome"
          placeholder="Nome do curso"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
          v-model="novoCurso.codigo"
          placeholder="Código"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
          v-model.number="novoCurso.cargaHorariaTotal"
          placeholder="Carga horária (h)"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
        >
          Criar Curso
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listarCursos, criarCurso } from '../services/cursoService';

const cursos = ref([]);
const novoCurso = ref({
  nome: '',
  codigo: '',
  cargaHorariaTotal: 0,
});

const handleSubmit = async () => {
  try {
    const { data } = await criarCurso(novoCurso.value);
    cursos.value.push(data);
    novoCurso.value = { nome: '', codigo: '', cargaHorariaTotal: 0 };
  } catch (error) {
    console.error('Erro ao criar curso:', error);
  }
};

onMounted(async () => {
  try {
    const { data } = await listarCursos();
    cursos.value = data;
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
  }
});
</script>
