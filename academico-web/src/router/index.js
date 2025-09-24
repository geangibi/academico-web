import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import CursosView from '../views/CursosView.vue';
import AlunosView from '../views/AlunosView.vue';
import DisciplinasView from '../views/DisciplinasView.vue';
import TurmasView from '../views/TurmasView.vue';
import Matricula from '../views/MatriculaView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        { path: '', redirect: '/cursos' },
        { path: 'cursos', component: CursosView },
        { path: 'alunos', component: AlunosView },
        { path: 'disciplinas', component: DisciplinasView },
        { path: 'turmas', component: TurmasView },
        { path: '/matricula', component: Matricula },
      ],
    },
  ],
});

export default router;
