<template>
  <div class="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
    <!-- Título -->
    <h1 class="text-3xl font-extrabold text-blue-700 mb-8 border-b pb-2">🏫 Turmas</h1>

    <!-- Formulário de criar turma -->
    <div class="bg-white p-6 rounded-2xl shadow-md mb-8">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">➕ Criar nova turma</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="form.nome"
          type="text"
          placeholder="Nome da turma"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          v-model="form.periodo"
          type="text"
          placeholder="2025/2"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <select
          v-model="form.cursoId"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option disabled value="">Selecione um curso</option>
          <option v-for="curso in cursos" :key="curso.id" :value="curso.id">{{ curso.nome }}</option>
        </select>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
        >
          Criar Turma
        </button>
      </form>
    </div>

    <!-- Lista de turmas -->
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Turmas cadastradas</h2>
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <li
        v-for="turma in turmas"
        :key="turma.id"
        class="relative bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1"
      >
        <!-- Botão de excluir no canto superior direito -->
        <button
          @click="excluirTurma(turma.id)"
          class="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
          title="Excluir turma"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
          </svg>
        </button>

        <!-- Título da turma -->
        <div class="font-bold text-gray-800 text-lg mb-2">{{ turma.nome }}</div>

        <!-- Informações do curso -->
        <div class="text-sm text-gray-500 mb-2">
          <div><span class="font-semibold">Curso:</span> {{ turma.curso?.nome || '—' }}</div>
          <div><span class="font-semibold">Código do curso:</span> {{ turma.curso?.codigo || '—' }}</div>
          <div><span class="font-semibold">Carga horária:</span> {{ turma.curso?.cargaHorariaTotal || '—' }}h</div>
        </div>

        <!-- Disciplinas -->
        <div class="mb-3">
          <span class="font-semibold text-gray-700">Disciplinas:</span>
          <div class="flex flex-wrap mt-1 gap-2">
            <span
              v-for="disc in turma.disciplinas"
              :key="disc.id"
              class="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
            >
              {{ disc.nome }}
            </span>
            <span v-if="!turma.disciplinas?.length" class="text-gray-400 text-sm">Sem disciplinas cadastradas</span>
          </div>
        </div>

     
            <div class="mt-2 flex flex-col gap-2">
              <!-- Botão de associar disciplinas -->
              <button
                @click="openModal(turma)"
                class="bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg shadow hover:bg-green-700 transition"
              >
                Associar Disciplinas
              </button>

              <!-- Botão de ver alunos -->
              <button
                @click="openAlunosModal(turma)"
                class="bg-indigo-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg shadow hover:bg-indigo-700 transition inline-flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20h6M3 20h5v-2a4 4 0 00-4-4H3m0-4h18M7 8a4 4 0 118 0 4 4 0 01-8 0z" />
                </svg>
                Ver Alunos
              </button>
            </div>


      </li>
    </ul>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg relative">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Associar Disciplinas — {{ selectedTurma.nome }}</h3>

        <!-- Input de pesquisa -->
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar disciplina..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <!-- Lista pesquisável -->
        <ul class="max-h-72 overflow-y-auto space-y-2">
          <li
            v-for="disciplina in filteredDisciplinas"
            :key="disciplina.id"
            @click="toggleDisciplina(disciplina.id)"
            :class="[
              'p-3 rounded-lg cursor-pointer shadow hover:shadow-lg transition flex justify-between items-center',
              selectedDisciplinaIds.includes(disciplina.id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            ]"
          >
            <span>{{ disciplina.nome }}</span>
            <span v-if="selectedDisciplinaIds.includes(disciplina.id)" class="text-sm font-bold">✔</span>
          </li>
        </ul>

        <!-- Botões do modal -->
        <div class="flex justify-end space-x-2 mt-4">
          <button
            @click="closeModal"
            class="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            @click="associarDisciplinas"
            class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de alunos -->
<!-- Modal de alunos -->
<div v-if="alunosModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
    <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
      👥 Alunos matriculados — {{ turmaComAlunos.nome }}
    </h3>

    <ul class="space-y-3 max-h-72 overflow-y-auto">
      <li
        v-for="aluno in turmaComAlunos.alunos"
        :key="aluno.id"
        class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
      >
        <div class="text-lg font-semibold text-gray-800">{{ aluno.nome }}</div>
        <div class="text-sm text-gray-600">📘 Matrícula: <span class="font-medium">{{ aluno.matricula }}</span></div>
        <div class="text-sm text-gray-600">🆔 CPF: <span class="font-medium">{{ aluno.cpf }}</span></div>
      </li>

      <li v-if="!turmaComAlunos.alunos?.length" class="text-gray-500 text-sm text-center py-4">
        Nenhum aluno matriculado nesta turma.
      </li>
    </ul>

    <div class="flex justify-end mt-6">
      <button
        @click="closeAlunosModal"
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Fechar
      </button>
    </div>
  </div>
</div>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { listarCursos } from '../services/cursoService';
import { listarDisciplinas } from '../services/disciplinaService';
import { listarTurmas, criarTurma, associarDisciplinaNaTurma } from '../services/turmaService';
import { removerTurma } from '../services/turmaService';

const cursos = ref([]);
const disciplinas = ref([]);
const turmas = ref([]);

const form = ref({ nome: '', periodo: '', cursoId: '' });

// Modal
const modalOpen = ref(false);
const selectedTurma = ref(null);
const selectedDisciplinaIds = ref([]);
const searchTerm = ref(''); // busca

const filteredDisciplinas = computed(() => {
  if (!searchTerm.value) return disciplinas.value;
  return disciplinas.value.filter(d =>
    d.nome.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Criar turma
async function handleSubmit() {
  try {
    const payload = {
      nome: form.value.nome.trim(),
      periodo: form.value.periodo.trim(),
      cursoId: form.value.cursoId,
      disciplinas: [],
      alunos: [],
    };
    const turmaCriada = await criarTurma(payload);
    turmas.value.push(turmaCriada);
    Object.assign(form.value, { nome: '', periodo: '', cursoId: '' });
  } catch (err) {
    console.error('Erro ao criar turma:', err);
  }
}

// Abrir modal
function openModal(turma) {
  selectedTurma.value = turma;
  selectedDisciplinaIds.value = turma.disciplinas?.map(d => d.id) || [];
  searchTerm.value = '';
  modalOpen.value = true;
}

// Fechar modal
function closeModal() {
  modalOpen.value = false;
  selectedTurma.value = null;
  selectedDisciplinaIds.value = [];
  searchTerm.value = '';
}

// Selecionar/desselecionar disciplina
function toggleDisciplina(disciplinaId) {
  if (selectedDisciplinaIds.value.includes(disciplinaId)) {
    selectedDisciplinaIds.value = selectedDisciplinaIds.value.filter(id => id !== disciplinaId);
  } else {
    selectedDisciplinaIds.value.push(disciplinaId);
  }
}

// Associar disciplinas
async function associarDisciplinas() {
  if (!selectedTurma.value) return;
  try {
    await Promise.all(
      selectedDisciplinaIds.value.map(id =>
        associarDisciplinaNaTurma(selectedTurma.value.id, id)
      )
    );
    selectedTurma.value.disciplinas = disciplinas.value.filter(d =>
      selectedDisciplinaIds.value.includes(d.id)
    );
    closeModal();
  } catch (err) {
    console.error('Erro ao associar disciplinas:', err);
  }
}

// Excluir turma
async function excluirTurma(id) {
  if (!confirm('Deseja realmente excluir esta turma?')) return;
  try {
    await removerTurma(id);
    turmas.value = turmas.value.filter(t => t.id !== id);
  } catch (err) {
    console.error('Erro ao excluir turma:', err);
    alert('Não foi possível excluir a turma.');
  }
}

// Carregar dados iniciais
onMounted(async () => {
  try {
    const cursosResponse = await listarCursos();
    cursos.value = cursosResponse.data;

    const disciplinasResponse = await listarDisciplinas();
    disciplinas.value = disciplinasResponse.map(d => ({ id: d.id, nome: d.nome }));

    turmas.value = await listarTurmas();
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  }
});

const alunosModalOpen = ref(false);
const turmaComAlunos = ref(null);

function openAlunosModal(turma) {
  turmaComAlunos.value = turma;
  alunosModalOpen.value = true;
}

function closeAlunosModal() {
  alunosModalOpen.value = false;
  turmaComAlunos.value = null;
}

</script>
