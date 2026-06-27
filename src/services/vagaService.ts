const API_BASE = "http://localhost:8080/api/v1";

export const MODALIDADES = ["Presencial", "Remoto", "Híbrido"] as const;
export type ModalidadeFiltro = "Todos" | (typeof MODALIDADES)[number];

export const AREAS = ["TI / Desenvolvimento", "Marketing", "Design", "Administração", "Engenharia", "Outro"] as const;

export interface Vaga {
  id: number;
  empresaId: number;
  nome: string;
  descricao: string;
  requisitos: string | null;
  modalidade: string | null;
  cidade: string | null;
  bairro: string | null;
  cargaHoraria: string | null;
  salario: string | null;
  area: string;
  dataCadastro: string;
  statusVaga: string;
  empresaNome: string;
  empresaInformacao: string | null;
}

async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("ERRO_SERVIDOR");
  return res.json();
}

async function buscarVagasEnriquecidas(): Promise<Vaga[]> {
  const [vagasRaw, empresas] = await Promise.all([
    getJson(`${API_BASE}/vaga?status=APROVADA`),
    getJson(`${API_BASE}/empresa`),
  ]);
  return vagasRaw.map((v: any) => {
    const empresa = empresas.find((e: any) => e.id === v.empresaId);
    return {
      ...v,
      empresaNome: empresa ? empresa.nome : "Empresa parceira",
      empresaInformacao: empresa ? empresa.informacao : null,
    };
  });
}

export async function getVagas(filtro: ModalidadeFiltro = "Todos"): Promise<Vaga[]> {
  const vagas = await buscarVagasEnriquecidas();
  if (filtro === "Todos") return vagas;
  return vagas.filter((v) => v.modalidade === filtro);
}

export async function searchVagas(query: string): Promise<Vaga[]> {
  const vagas = await buscarVagasEnriquecidas();
  const q = query.toLowerCase();
  return vagas.filter(
    (v) =>
      v.nome.toLowerCase().includes(q) ||
      v.empresaNome.toLowerCase().includes(q) ||
      v.area.toLowerCase().includes(q)
  );
}

export async function getVagaById(id: string): Promise<Vaga | undefined> {
  const vagas = await buscarVagasEnriquecidas();
  return vagas.find((v) => String(v.id) === id);
}

export interface AreaVisual {
  icon: string;
  color: string;
  bg: string;
}

const AREA_VISUAL: Record<string, AreaVisual> = {
  "TI / Desenvolvimento": { icon: "code-slash-outline", color: "#43A047", bg: "#E8F5E9" },
  "Marketing": { icon: "trending-up-outline", color: "#1976D2", bg: "#E3F2FD" },
  "Design": { icon: "color-palette-outline", color: "#9C27B0", bg: "#F3E5F5" },
  "Administração": { icon: "people-outline", color: "#E91E63", bg: "#FCE4EC" },
  "Engenharia": { icon: "construct-outline", color: "#F57C00", bg: "#FFF3E0" },
  "Outro": { icon: "ellipsis-horizontal-circle-outline", color: "#3F51B5", bg: "#E8EAF6" },
};

const AREA_VISUAL_PADRAO: AreaVisual = { icon: "business-outline", color: "#6B7280", bg: "#F3F4F6" };

export function getAreaVisual(area: string): AreaVisual {
  return AREA_VISUAL[area] ?? AREA_VISUAL_PADRAO;
}
