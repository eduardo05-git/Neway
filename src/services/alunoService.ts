const API_BASE = "http://localhost:8080/api/v1";

export interface Aluno {
  id: number;
  usuarioId: number;
  nome: string;
  rm: string;
  curso: string;
  conclusao: string;
  dataNascimento: string;
  dataCadastro: string;
  statusAluno: string;
  bio?: string | null;
  habilidades?: string | null;
  linkPortfolio?: string | null;
  linkCurriculo?: string | null;
}

export interface AtualizarAlunoInput {
  bio: string;
  habilidades: string;
  linkPortfolio: string;
  linkCurriculo: string;
}

export interface Candidatura {
  id: number;
  alunoId: number;
  vagaId: number;
  dataCadastro: string;
  statusCandidatura: string;
  vagaTitulo: string;
  empresaNome: string;
}

async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("ERRO_SERVIDOR");
  return res.json();
}

export async function getMeuAluno(usuarioId: number): Promise<Aluno | null> {
  const alunos = await getJson(`${API_BASE}/aluno`);
  return alunos.find((a: any) => a.usuarioId === usuarioId) ?? null;
}

export async function getMinhasCandidaturas(alunoId: number): Promise<Candidatura[]> {
  const [candidaturas, vagas, empresas] = await Promise.all([
    getJson(`${API_BASE}/candidatura/aluno/${alunoId}`),
    getJson(`${API_BASE}/vaga`),
    getJson(`${API_BASE}/empresa`),
  ]);
  return candidaturas.map((c: any) => {
    const vaga = vagas.find((v: any) => v.id === c.vagaId);
    const empresa = vaga ? empresas.find((e: any) => e.id === vaga.empresaId) : null;
    return {
      ...c,
      vagaTitulo: vaga ? vaga.nome : "Vaga removida",
      empresaNome: empresa ? empresa.nome : "—",
    };
  });
}

export async function getCandidaturaVagaIds(alunoId: number): Promise<number[]> {
  const candidaturas = await getJson(`${API_BASE}/candidatura/aluno/${alunoId}`);
  return candidaturas.map((c: any) => c.vagaId);
}

export async function atualizarAluno(alunoId: number, dados: AtualizarAlunoInput): Promise<Aluno> {
  const res = await fetch(`${API_BASE}/aluno/${alunoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("ERRO_ATUALIZAR_ALUNO");
  return res.json();
}

export async function candidatar(alunoId: number, vagaId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/candidatura`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alunoId, vagaId }),
  });
  if (!res.ok) throw new Error("ERRO_CANDIDATURA");
}

export function statusCandidaturaInfo(status: string) {
  if (status === "VISUALIZADA") return { label: "Vista pela empresa", bg: "#16A34A", text: "#fff" };
  return { label: "Enviada", bg: "#1A6FE8", text: "#fff" };
}
