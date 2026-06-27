import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getVagaById, getAreaVisual, type Vaga } from "@/services/vagaService";
import { getUsuarioLogado } from "@/services/authService";
import { getMeuAluno, getCandidaturaVagaIds, candidatar } from "@/services/alunoService";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAG_COLOR: Record<string, { border: string; text: string; bg: string }> = {
  Remoto:     { border: "#BFDBFE", text: "#2563EB", bg: "#EFF6FF" },
  Híbrido:    { border: "#DDD6FE", text: "#7C3AED", bg: "#F5F3FF" },
  Presencial: { border: "#FED7AA", text: "#EA580C", bg: "#FFF7ED" },
};

const SHADOW = {
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.055,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
};

function SectionTitle({ icon, label }: { icon: IoniconName; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <View style={{
        width: 36, height: 36, borderRadius: 11,
        backgroundColor: "#EFF6FF",
        alignItems: "center", justifyContent: "center",
      }}>
        <Ionicons name={icon} size={18} color="#1A6FE8" />
      </View>
      <Text style={{ fontSize: 17, fontWeight: "800", color: "#111827" }}>{label}</Text>
    </View>
  );
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [jaCandidatado, setJaCandidatado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroCandidatura, setErroCandidatura] = useState("");

  useEffect(() => {
    getVagaById(id).then((data) => {
      setVaga(data ?? null);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    (async () => {
      const usuario = await getUsuarioLogado();
      if (!usuario) return;
      const aluno = await getMeuAluno(usuario.id);
      if (!aluno) return;
      setAlunoId(aluno.id);
      const vagaIds = await getCandidaturaVagaIds(aluno.id);
      if (vagaIds.includes(Number(id))) setJaCandidatado(true);
    })();
  }, [id]);

  async function handleCandidatar() {
    if (!alunoId) {
      setErroCandidatura("Não encontramos seu cadastro de aluno. Faça login novamente.");
      return;
    }
    setEnviando(true);
    setErroCandidatura("");
    try {
      await candidatar(alunoId, Number(id));
      setJaCandidatado(true);
    } catch {
      setErroCandidatura("Não foi possível enviar sua candidatura. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1A6FE8" />
      </SafeAreaView>
    );
  }

  if (!vaga) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#6B7280", fontSize: 15 }}>Vaga não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const local = [vaga.bairro, vaga.cidade].filter(Boolean).join(" - ");
  const requisitos = (vaga.requisitos ?? "").split(/\n|,/).map((r) => r.trim()).filter(Boolean);
  const visual = getAreaVisual(vaga.area);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* ── Header ── */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 18, paddingVertical: 12,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42, height: 42, borderRadius: 13,
            backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB",
            alignItems: "center", justifyContent: "center", ...SHADOW,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>neway</Text>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 18, paddingBottom: 130, gap: 14 }}>

          {/* ── Card principal ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, ...SHADOW }}>
            <View style={{
              width: 76, height: 76, borderRadius: 20,
              backgroundColor: visual.bg,
              alignItems: "center", justifyContent: "center", marginBottom: 18,
            }}>
              <Ionicons name={visual.icon as any} size={36} color={visual.color} />
            </View>

            {/* Tags */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {[vaga.area, vaga.modalidade].filter(Boolean).map((tag) => {
                const tc = TAG_COLOR[tag as string] ?? { border: "#E5E7EB", text: "#6B7280", bg: "#F9FAFB" };
                return (
                  <View key={tag as string} style={{
                    borderWidth: 1.5, borderColor: tc.border,
                    backgroundColor: tc.bg,
                    borderRadius: 20, paddingHorizontal: 13, paddingVertical: 6,
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: tc.text }}>{tag}</Text>
                  </View>
                );
              })}
            </View>

            <Text style={{
              fontSize: 23, fontWeight: "800", color: "#111827",
              lineHeight: 32, marginBottom: 8,
            }}>
              {vaga.nome}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#1A6FE8", marginBottom: 20 }}>
              {vaga.empresaNome}
            </Text>

            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                <Ionicons name="location-outline" size={15} color="#9CA3AF" />
                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                  {local || "Local a combinar"}{vaga.cargaHoraria ? ` · ${vaga.cargaHoraria}` : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                <Ionicons name="cash-outline" size={16} color="#1A6FE8" />
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#1A6FE8" }}>
                  {vaga.salario || "A combinar"}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Descrição da Vaga ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 22, ...SHADOW }}>
            <SectionTitle icon="document-text-outline" label="Descrição da Vaga" />
            <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 26 }}>
              {vaga.descricao}
            </Text>
          </View>

          {/* ── Requisitos ── */}
          {requisitos.length > 0 && (
            <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 22, ...SHADOW }}>
              <SectionTitle icon="checkmark-done-circle-outline" label="Requisitos" />
              <View style={{ gap: 16 }}>
                {requisitos.map((req, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                    <View style={{
                      width: 24, height: 24, borderRadius: 12,
                      backgroundColor: "#DCFCE7",
                      alignItems: "center", justifyContent: "center",
                      marginTop: 1, flexShrink: 0,
                    }}>
                      <Ionicons name="checkmark" size={14} color="#16A34A" />
                    </View>
                    <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 24, flex: 1 }}>
                      {req}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Sobre a empresa ── */}
          {vaga.empresaInformacao && (
            <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 22, ...SHADOW }}>
              <Text style={{
                fontSize: 11, fontWeight: "800", color: "#9CA3AF",
                letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16,
              }}>
                Sobre a Empresa
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 26 }}>
                {vaga.empresaInformacao}
              </Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1, borderTopColor: "#F0F0F0",
        paddingHorizontal: 18, paddingTop: 16, paddingBottom: 34,
      }}>
        {erroCandidatura ? (
          <Text style={{ color: "#EF4444", fontSize: 13, textAlign: "center", marginBottom: 10 }}>
            {erroCandidatura}
          </Text>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCandidatar}
          disabled={jaCandidatado || enviando}
          style={{
            backgroundColor: jaCandidatado ? "#16A34A" : "#1A6FE8",
            borderRadius: 16, paddingVertical: 15,
            alignItems: "center", justifyContent: "center",
            flexDirection: "row", gap: 8,
            opacity: enviando ? 0.7 : 1,
            shadowColor: jaCandidatado ? "#16A34A" : "#1A6FE8", shadowOpacity: 0.3,
            shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4,
          }}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : jaCandidatado ? (
            <>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>Candidatura Enviada</Text>
            </>
          ) : (
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>Candidatar-se</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
