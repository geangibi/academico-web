<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar Desktop -->
    <aside
      :class="[
        'bg-white border-r flex flex-col transition-all duration-300 shadow-sm',
        sidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Top bar com toggle -->
      <div class="h-16 flex items-center justify-between px-4 border-b">
        <span v-if="sidebarOpen" class="text-blue-600 font-bold text-lg">🎓 Acadêmico</span>
        <button
          @click="toggleSidebar"
          class="text-gray-500 hover:text-gray-700 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {{ sidebarOpen ? '«' : '☰' }}
        </button>
      </div>

      <!-- Links -->
      <nav class="flex-1 mt-4 space-y-2">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          :class="isActive(item.to) ? 'bg-blue-100 text-blue-600 font-medium' : ''"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="truncate">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="p-3 text-xs text-gray-400 border-t">
        <span v-if="sidebarOpen">v0.1 • Gean Dev</span>
      </div>
    </aside>

    <!-- Conteúdo -->
    <div class="flex-1 flex flex-col">
      <main class="p-6 flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const items = [
  { to: '/alunos', label: 'Alunos', icon: '👨‍🎓' },
  { to: '/cursos', label: 'Cursos', icon: '📚' },
  { to: '/disciplinas', label: 'Disciplinas', icon: '📝' },
  { to: '/turmas', label: 'Turmas', icon: '🏫' },
  { to: '/matricula', label: 'Matrícula', icon: '✅' },
];

const isActive = (to) => route.path.startsWith(to);
</script>
