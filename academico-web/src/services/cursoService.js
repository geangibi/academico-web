import api from './api';

export const listarCursos = () => api.get('/cursos');
export const criarCurso = (curso) => api.post('/cursos', curso);
