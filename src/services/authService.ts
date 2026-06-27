import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://localhost:8080/api/v1";
const USER_KEY = "user";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  nivelAcesso: "ESTUDANTE" | "EMPRESA" | "ADMIN";
  statusUsuario?: string;
}

export interface CadastroAlunoInput {
  nome: string;
  email: string;
  senha: string;
  rm: string;
  curso: string;
  conclusao: string;
  dataNascimentoISO: string;
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

export async function login(email: string, senha: string): Promise<Usuario> {
  const res = await postJson(`${API_BASE}/usuario/login`, { email, senha });

  if (res.status === 401) throw new Error("CREDENCIAIS_INVALIDAS");
  if (!res.ok) throw new Error("ERRO_SERVIDOR");

  const usuario: Usuario = await res.json();

  if (usuario.nivelAcesso !== "ESTUDANTE") {
    throw new Error("NAO_ESTUDANTE");
  }

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
  return usuario;
}

export async function cadastrarAluno(input: CadastroAlunoInput): Promise<Usuario> {
  const resUsuario = await postJson(`${API_BASE}/usuario`, {
    nome: input.nome,
    email: input.email,
    senha: input.senha,
    nivelAcesso: "ESTUDANTE",
  });
  if (resUsuario.status === 409) throw new Error("EMAIL_JA_CADASTRADO");
  if (!resUsuario.ok) throw new Error("ERRO_USUARIO");
  const usuario: Usuario = await resUsuario.json();

  const resAluno = await postJson(`${API_BASE}/aluno`, {
    usuarioId: usuario.id,
    nome: input.nome,
    rm: input.rm,
    curso: input.curso,
    conclusao: input.conclusao,
    dataNascimento: input.dataNascimentoISO,
  });
  if (!resAluno.ok) throw new Error("ERRO_ALUNO");

  return usuario;
}

export async function getUsuarioLogado(): Promise<Usuario | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function atualizarUsuario(id: number, dados: { nome: string; email: string }): Promise<Usuario> {
  const res = await fetch(`${API_BASE}/usuario/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("ERRO_ATUALIZAR_USUARIO");
  const atualizado: Usuario = await res.json();

  const atual = await getUsuarioLogado();
  await AsyncStorage.setItem(USER_KEY, JSON.stringify({ ...atual, ...atualizado }));
  return atualizado;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
