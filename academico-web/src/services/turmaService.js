const baseURL = 'http://localhost:8080/turmas';

export async function listarTurmas() {
  const res = await fetch(baseURL);
  if (!res.ok) throw new Error('Erro ao listar turmas');
  return res.json();
}

export async function criarTurma(payload) {
  const res = await fetch(baseURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Erro ao criar turma');
    throw new Error(msg || 'Erro ao criar turma');
  }
  return res.json();
}

/**
 * Associa uma disciplina a uma turma
 * @param {number|string} turmaId
 * @param {number|string} disciplinaId
 */
export async function associarDisciplinaNaTurma(turmaId, disciplinaId) {
  const url = `${baseURL}/${turmaId}/disciplinas/${disciplinaId}`;
  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    const msg = await res.text().catch(() => 'Erro ao associar disciplina');
    throw new Error(msg || 'Erro ao associar disciplina');
  }

  return res.json();
}

/**
 * Remove uma turma pelo ID
 * @param {number|string} turmaId
 */
export async function removerTurma(turmaId) {
  const url = `${baseURL}/${turmaId}`;
  const res = await fetch(url, { method: 'DELETE' });

  if (!res.ok) {
    const msg = await res.text().catch(() => 'Erro ao remover turma');
    throw new Error(msg || 'Erro ao remover turma');
  }

  return true; // sucesso
}

/**
 * Associa um aluno a uma turma
 * @param {number|string} turmaId
 * @param {number|string} alunoId
 */
export async function associarAlunoNaTurma(turmaId, alunoId) {
  const url = `${baseURL}/${turmaId}/alunos/${alunoId}`;
  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    const msg = await res.text().catch(() => 'Erro ao associar aluno');
    throw new Error(msg || 'Erro ao associar aluno');
  }

  return res.json();
}

