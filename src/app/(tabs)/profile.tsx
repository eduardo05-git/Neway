import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getUsuarioLogado, logout, atualizarUsuario, type Usuario } from "@/services/authService";
import {
  getMeuAluno,
  getMinhasCandidaturas,
  atualizarAluno,
  statusCandidaturaInfo,
  type Aluno,
  type Candidatura,
} from "@/services/alunoService";

const CARD_SHADOW = {
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
};

const CARD_STYLE = {
  backgroundColor: "#fff",
  borderRadius: 22,
  borderWidth: 1,
  borderColor: "#F0F0F0",
  padding: 20,
  ...CARD_SHADOW,
};

function iniciais(nome: string) {
  return nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function habilidadesParaArray(habilidades?: string | null) {
  return habilidades ? habilidades.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function InfoRow({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={17} color="#1A6FE8" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>{label}</Text>
        <Text style={{ fontSize: 14.5, fontWeight: "600", color: "#111827" }}>{value}</Text>
      </View>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={{ fontSize: 12, fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>
      {children}
    </Text>
  );
}

function CandidaturaCard({ c }: { c: Candidatura }) {
  const s = statusCandidaturaInfo(c.statusCandidatura);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        paddingHorizontal: 18,
        paddingVertical: 18,
        marginBottom: 12,
        ...CARD_SHADOW,
      }}
    >
      <View style={{
        width: 50, height: 50, borderRadius: 14,
        backgroundColor: "#DBEAFE",
        alignItems: "center", justifyContent: "center",
        marginRight: 14, flexShrink: 0,
      }}>
        <Ionicons name="briefcase-outline" size={22} color="#1A6FE8" />
      </View>

      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827" }}>{c.vagaTitulo}</Text>
        <Text style={{ fontSize: 13, color: "#1A6FE8", fontWeight: "600" }}>{c.empresaNome}</Text>
        <Text style={{ fontSize: 12, color: "#B0B7C3" }}>
          Enviada em {new Date(c.dataCadastro).toLocaleDateString("pt-BR")}
        </Text>
      </View>

      <View style={{
        backgroundColor: s.bg, borderRadius: 20,
        paddingHorizontal: 11, paddingVertical: 5,
      }}>
        <Text style={{ fontSize: 11, fontWeight: "700", color: s.text }}>{s.label}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [habilidades, setHabilidades] = useState<string[]>([]);
  const [novaHabilidade, setNovaHabilidade] = useState("");
  const [linkCurriculo, setLinkCurriculo] = useState("");
  const [linkPortfolio, setLinkPortfolio] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await getUsuarioLogado();
        if (!u) {
          setErro("Sessão expirada. Faça login novamente.");
          setLoading(false);
          return;
        }
        setUsuario(u);
        setNome(u.nome);
        setEmail(u.email);
        const a = await getMeuAluno(u.id);
        setAluno(a);
        if (a) {
          setBio(a.bio || "");
          setHabilidades(habilidadesParaArray(a.habilidades));
          setLinkCurriculo(a.linkCurriculo || "");
          setLinkPortfolio(a.linkPortfolio || "");
          setCandidaturas(await getMinhasCandidaturas(a.id));
        }
      } catch {
        setErro("Não foi possível carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  function iniciarEdicao() {
    if (!usuario) return;
    setNome(usuario.nome);
    setEmail(usuario.email);
    setBio(aluno?.bio || "");
    setHabilidades(habilidadesParaArray(aluno?.habilidades));
    setLinkCurriculo(aluno?.linkCurriculo || "");
    setLinkPortfolio(aluno?.linkPortfolio || "");
    setFeedback("");
    setEditando(true);
  }

  function adicionarHabilidade() {
    const valor = novaHabilidade.trim();
    if (valor && !habilidades.includes(valor)) {
      setHabilidades([...habilidades, valor]);
    }
    setNovaHabilidade("");
  }

  function removerHabilidade(h: string) {
    setHabilidades(habilidades.filter((item) => item !== h));
  }

  async function handleSalvar() {
    if (!usuario) return;
    setSalvando(true);
    setFeedback("");
    try {
      const usuarioAtualizado = await atualizarUsuario(usuario.id, { nome, email });
      setUsuario(usuarioAtualizado);

      if (aluno) {
        const alunoAtualizado = await atualizarAluno(aluno.id, {
          bio,
          habilidades: habilidades.join(", "),
          linkPortfolio,
          linkCurriculo,
        });
        setAluno(alunoAtualizado);
      }
      setEditando(false);
    } catch {
      setFeedback("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1A6FE8" />
      </SafeAreaView>
    );
  }

  if (erro || !usuario) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center", paddingHorizontal: 30 }}>
        <Text style={{ color: "#6B7280", fontSize: 15, textAlign: "center", marginBottom: 20 }}>
          {erro || "Não foi possível carregar seu perfil."}
        </Text>
        <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: "#1A6FE8", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Voltar ao login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 22, paddingTop: 10, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: "#F0F0F0", backgroundColor: "#F9FAFB",
      }}>
        <Text style={{ fontSize: 19, fontWeight: "700", color: "#111827" }}>neway</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          {!editando && (
            <TouchableOpacity onPress={iniciarEdicao} style={{ padding: 4 }}>
              <Ionicons name="create-outline" size={24} color="#374151" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleLogout} style={{ padding: 4 }}>
            <Ionicons name="log-out-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

        {/* ── Perfil hero ── */}
        <View style={{
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: 36,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}>
          <View style={{
            width: 96, height: 96, borderRadius: 26,
            backgroundColor: "#1A6FE8",
            alignItems: "center", justifyContent: "center", marginBottom: 18,
          }}>
            <Text style={{ fontSize: 32, fontWeight: "800", color: "#fff" }}>
              {iniciais(usuario.nome)}
            </Text>
          </View>

          {editando ? (
            <View style={{ width: "100%", gap: 10, marginBottom: 6 }}>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                style={{ textAlign: "center", fontSize: 20, fontWeight: "800", color: "#111827", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 6 }}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ textAlign: "center", fontSize: 14, color: "#374151", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 6 }}
              />
            </View>
          ) : (
            <>
              <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827", marginBottom: 6, textAlign: "center" }}>
                {usuario.nome}
              </Text>
              {aluno && (
                <Text style={{ fontSize: 14, color: "#1A6FE8", fontWeight: "600", marginBottom: 16, textAlign: "center" }}>
                  {aluno.curso}
                </Text>
              )}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="mail-outline" size={15} color="#9CA3AF" />
                <Text style={{ fontSize: 13, color: "#9CA3AF" }}>{usuario.email}</Text>
              </View>
            </>
          )}
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 14 }}>

          {feedback ? (
            <Text style={{ color: "#EF4444", fontSize: 13, textAlign: "center" }}>{feedback}</Text>
          ) : null}

          {/* ── Dados do aluno ── */}
          {aluno && (
            <View style={{ ...CARD_STYLE, paddingVertical: 8 }}>
              <InfoRow icon="card-outline" label="RM" value={aluno.rm} />
              <InfoRow icon="school-outline" label="Curso" value={aluno.curso} />
              <InfoRow icon="calendar-outline" label="Previsão de conclusão" value={aluno.conclusao} />
            </View>
          )}

          {/* ── Sobre mim ── */}
          {aluno && (editando || bio) ? (
            <View style={CARD_STYLE}>
              <SectionLabel>Sobre mim</SectionLabel>
              {editando ? (
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Escreva um breve resumo sobre você..."
                  multiline
                  numberOfLines={4}
                  style={{ fontSize: 14, color: "#374151", minHeight: 90, textAlignVertical: "top" }}
                />
              ) : (
                <Text style={{ fontSize: 14, color: "#374151", lineHeight: 21 }}>{bio}</Text>
              )}
            </View>
          ) : null}

          {/* ── Habilidades ── */}
          {aluno && (editando || habilidades.length > 0) && (
            <View style={CARD_STYLE}>
              <SectionLabel>Habilidades</SectionLabel>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: editando ? 12 : 0 }}>
                {habilidades.map((h) => (
                  <View key={h} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#EFF6FF", borderRadius: 20, paddingLeft: 13, paddingRight: editando ? 8 : 13, paddingVertical: 6, gap: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: "#1A6FE8" }}>{h}</Text>
                    {editando && (
                      <TouchableOpacity onPress={() => removerHabilidade(h)}>
                        <Ionicons name="close-circle" size={16} color="#1A6FE8" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
              {editando && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TextInput
                    value={novaHabilidade}
                    onChangeText={setNovaHabilidade}
                    onSubmitEditing={adicionarHabilidade}
                    placeholder="Nova habilidade..."
                    style={{ flex: 1, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 }}
                  />
                  <TouchableOpacity onPress={adicionarHabilidade} style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#1A6FE8", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="add" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* ── Currículo e Portfólio ── */}
          {aluno && (editando || linkCurriculo || linkPortfolio) ? (
            <View style={CARD_STYLE}>
              <SectionLabel>Link do Currículo</SectionLabel>
              {editando ? (
                <TextInput
                  value={linkCurriculo}
                  onChangeText={setLinkCurriculo}
                  placeholder="https://drive.google.com/..."
                  autoCapitalize="none"
                  style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, marginBottom: 18 }}
                />
              ) : linkCurriculo ? (
                <TouchableOpacity onPress={() => Linking.openURL(linkCurriculo)} style={{ marginBottom: 18 }}>
                  <Text style={{ color: "#1A6FE8", fontWeight: "600", fontSize: 14 }}>Abrir currículo →</Text>
                </TouchableOpacity>
              ) : null}

              <SectionLabel>Portfólio / LinkedIn</SectionLabel>
              {editando ? (
                <TextInput
                  value={linkPortfolio}
                  onChangeText={setLinkPortfolio}
                  placeholder="https://meu-portfolio.com"
                  autoCapitalize="none"
                  style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 }}
                />
              ) : linkPortfolio ? (
                <TouchableOpacity onPress={() => Linking.openURL(linkPortfolio)}>
                  <Text style={{ color: "#1A6FE8", fontWeight: "600", fontSize: 14 }} numberOfLines={1}>{linkPortfolio}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          {editando && (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setEditando(false)}
                style={{ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: "#F3F4F6" }}
              >
                <Text style={{ fontWeight: "700", color: "#374151" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSalvar}
                disabled={salvando}
                style={{ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: "#1A6FE8", opacity: salvando ? 0.7 : 1 }}
              >
                {salvando ? <ActivityIndicator color="#fff" /> : <Text style={{ fontWeight: "700", color: "#fff" }}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          )}

          {!editando && (
            <>
              {/* ── Estatística ── */}
              <View style={{
                backgroundColor: "#0F172A", borderRadius: 22,
                paddingVertical: 36, alignItems: "center",
                ...CARD_SHADOW, shadowOpacity: 0.18,
              }}>
                <Text style={{ fontSize: 52, fontWeight: "900", color: "#fff", lineHeight: 58 }}>
                  {candidaturas.length}
                </Text>
                <Text style={{ fontSize: 14, color: "#64748B", marginTop: 6, letterSpacing: 0.5, fontWeight: "500" }}>
                  {candidaturas.length === 1 ? "Candidatura Enviada" : "Candidaturas Enviadas"}
                </Text>
              </View>

              {/* ── Minhas Candidaturas ── */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2, paddingTop: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>Minhas Candidaturas</Text>
              </View>

              {candidaturas.length === 0 ? (
                <View style={{ alignItems: "center", paddingVertical: 30 }}>
                  <Ionicons name="briefcase-outline" size={40} color="#D1D5DB" />
                  <Text style={{ color: "#9CA3AF", marginTop: 10, fontSize: 14 }}>
                    Você ainda não se candidatou a nenhuma vaga.
                  </Text>
                </View>
              ) : (
                candidaturas.map((c) => <CandidaturaCard key={c.id} c={c} />)
              )}
            </>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
