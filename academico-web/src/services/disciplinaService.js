const baseURL = 'http://localhost:8080/disciplinas';

export async function listarDisciplinas() {
  const res = await fetch(baseURL);
  if (!res.ok) throw new Error('Erro ao listar disciplinas');
  return res.json();
}

export async function criarDisciplina(payload) {
  const res = await fetch(baseURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Erro ao criar disciplina');
    throw new Error(msg || 'Erro ao criar disciplina');
  }
  return res.json();
}
