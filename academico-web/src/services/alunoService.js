// Ajuste a baseURL conforme sua API
const baseURL = 'http://localhost:8080/alunos';

export async function listarAlunos() {
  const res = await fetch(baseURL);
  if (!res.ok) throw new Error('Falha ao listar alunos');
  return res.json();
}

export async function criarAluno(payload) {
  const res = await fetch(baseURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Falha ao criar aluno');
    throw new Error(msg || 'Falha ao criar aluno');
  }
  return res.json();
}
