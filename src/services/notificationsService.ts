import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsuarioLogado } from "./authService";
import { getMeuAluno, getMinhasCandidaturas } from "./alunoService";
import { getVagas } from "./vagaService";

const LIDAS_KEY = "notificacoes_lidas";

export type NotificationType = "application_viewed" | "job_match";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
  group: "today" | "yesterday" | "older";
}

function tempoRelativo(data: Date): string {
  const diffMin = Math.floor((Date.now() - data.getTime()) / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  return `${Math.floor(diffH / 24)}d`;
}

function grupoPorData(data: Date): "today" | "yesterday" | "older" {
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  const mesmoDia = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (mesmoDia(data, hoje)) return "today";
  if (mesmoDia(data, ontem)) return "yesterday";
  return "older";
}

async function getLidas(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(LIDAS_KEY);
  return new Set(raw ? JSON.parse(raw) : []);
}

export async function getNotifications(): Promise<Notification[]> {
  const usuario = await getUsuarioLogado();
  if (!usuario) return [];

  const aluno = await getMeuAluno(usuario.id);
  if (!aluno) return [];

  const lidas = await getLidas();
  const candidaturas = await getMinhasCandidaturas(aluno.id);

  const itens: { notificacao: Notification; data: Date }[] = [];

  candidaturas
    .filter((c) => c.statusCandidatura === "VISUALIZADA")
    .forEach((c) => {
      const data = new Date(c.dataCadastro);
      const id = `cand-${c.id}-vista`;
      itens.push({
        data,
        notificacao: {
          id,
          type: "application_viewed",
          title: "Sua candidatura foi visualizada",
          description: `${c.empresaNome} visualizou sua candidatura para a vaga de ${c.vagaTitulo}.`,
          time: tempoRelativo(data),
          read: lidas.has(id),
          group: grupoPorData(data),
          actionLabel: "Ver Candidaturas",
          actionRoute: "/(tabs)/profile",
        },
      });
    });

  const vagaIdsCandidatadas = new Set(candidaturas.map((c) => c.vagaId));
  const vagas = await getVagas("Todos");
  vagas
    .filter((v) => !vagaIdsCandidatadas.has(v.id))
    .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime())
    .slice(0, 5)
    .forEach((v) => {
      const data = new Date(v.dataCadastro);
      const id = `vaga-${v.id}-nova`;
      itens.push({
        data,
        notificacao: {
          id,
          type: "job_match",
          title: "Nova vaga disponível",
          description: `${v.nome} na ${v.empresaNome}. Área: ${v.area}.`,
          time: tempoRelativo(data),
          read: lidas.has(id),
          group: grupoPorData(data),
          actionLabel: "Ver Vaga",
          actionRoute: `/(tabs)/jobs/${v.id}`,
        },
      });
    });

  return itens
    .sort((a, b) => b.data.getTime() - a.data.getTime())
    .map((i) => i.notificacao);
}

export async function markAllAsRead(): Promise<void> {
  const notificacoes = await getNotifications();
  const lidas = await getLidas();
  notificacoes.forEach((n) => lidas.add(n.id));
  await AsyncStorage.setItem(LIDAS_KEY, JSON.stringify([...lidas]));
}
