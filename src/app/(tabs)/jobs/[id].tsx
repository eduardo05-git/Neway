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
import { getJobById, toggleSaveJob } from "@/services/jobsService";
import type { Job } from "@/mocks/jobs";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAG_COLOR: Record<string, { border: string; text: string; bg: string }> = {
  Remoto:           { border: "#BFDBFE", text: "#2563EB", bg: "#EFF6FF" },
  Híbrido:          { border: "#DDD6FE", text: "#7C3AED", bg: "#F5F3FF" },
  Presencial:       { border: "#FED7AA", text: "#EA580C", bg: "#FFF7ED" },
  "Tempo Integral": { border: "#BFDBFE", text: "#2563EB", bg: "#EFF6FF" },
  "Meio Período":   { border: "#BBF7D0", text: "#16A34A", bg: "#F0FDF4" },
  Freelance:        { border: "#FBCFE8", text: "#DB2777", bg: "#FDF2F8" },
};

const BENEFIT_CONFIG: Record<string, { icon: IoniconName; color: string; bg: string }> = {
  heart:        { icon: "shield-checkmark-outline", color: "#1A6FE8", bg: "#EFF6FF" },
  "fork.knife": { icon: "restaurant-outline",       color: "#F97316", bg: "#FFF7ED" },
  house:        { icon: "laptop-outline",            color: "#1A6FE8", bg: "#EFF6FF" },
  book:         { icon: "school-outline",            color: "#16A34A", bg: "#F0FDF4" },
  "figure.run": { icon: "fitness-outline",           color: "#7C3AED", bg: "#F5F3FF" },
  car:          { icon: "car-outline",               color: "#6B7280", bg: "#F3F4F6" },
  airplane:     { icon: "trending-up-outline",       color: "#0891B2", bg: "#ECFEFF" },
  gift:         { icon: "gift-outline",              color: "#EC4899", bg: "#FDF2F8" },
};

const SHADOW = {
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.055,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
};

function formatSalary(min: number, max: number) {
  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;
  return `${fmt(min)} - ${fmt(max)}`;
}

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

function highlightCompany(text: string, company: string) {
  const parts = text.split(company);
  return parts.reduce<React.ReactNode[]>((acc, part, i) => {
    if (i > 0) {
      acc.push(
        <Text key={`c${i}`} style={{ color: "#1A6FE8", fontWeight: "700" }}>
          {company}
        </Text>
      );
    }
    acc.push(part);
    return acc;
  }, []);
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getJobById(id).then((data) => {
      if (data) { setJob(data); setSaved(data.isSaved); }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    if (!job) return;
    const newState = await toggleSaveJob(job.id);
    setSaved(newState);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1A6FE8" />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#6B7280", fontSize: 15 }}>Vaga não encontrada.</Text>
      </SafeAreaView>
    );
  }

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

        <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>Neway</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity style={{
            width: 42, height: 42, borderRadius: 13,
            backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB",
            alignItems: "center", justifyContent: "center", ...SHADOW,
          }}>
            <Ionicons name="options-outline" size={20} color="#374151" />
          </TouchableOpacity>
          <View style={{
            width: 42, height: 42, borderRadius: 13,
            backgroundColor: "#1E293B",
            alignItems: "center", justifyContent: "center",
          }}>
            <Ionicons name="person" size={19} color="#fff" />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 18, paddingBottom: 130, gap: 14 }}>

          {/* ── Card principal ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, ...SHADOW }}>
            {/* Logo */}
            <View style={{
              width: 76, height: 76, borderRadius: 20,
              backgroundColor: "#1E293B",
              alignItems: "center", justifyContent: "center", marginBottom: 18,
            }}>
              <Ionicons name="business" size={36} color="rgba(255,255,255,0.65)" />
            </View>

            {/* Tags */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {[job.type, job.regime].map((tag) => {
                const tc = TAG_COLOR[tag] ?? { border: "#E5E7EB", text: "#6B7280", bg: "#F9FAFB" };
                return (
                  <View key={tag} style={{
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
              {job.title}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#1A6FE8", marginBottom: 20 }}>
              {job.company}
            </Text>

            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                <Ionicons name="location-outline" size={15} color="#9CA3AF" />
                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                  {job.location}, {job.state} ({job.type})
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                <Ionicons name="cash-outline" size={16} color="#1A6FE8" />
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#1A6FE8" }}>
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Descrição da Vaga ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 22, ...SHADOW }}>
            <SectionTitle icon="document-text-outline" label="Descrição da Vaga" />
            <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 26 }}>
              {job.description}
            </Text>
          </View>

          {/* ── Requisitos ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 22, ...SHADOW }}>
            <SectionTitle icon="checkmark-done-circle-outline" label="Requisitos" />
            <View style={{ gap: 16 }}>
              {job.requirements.map((req, i) => (
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

          {/* ── Benefícios ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 22, ...SHADOW }}>
            <SectionTitle icon="gift-outline" label="Benefícios" />
            <View style={{ gap: 10 }}>
              {job.benefits.map((b, i) => {
                const cfg = BENEFIT_CONFIG[b.icon] ?? {
                  icon: "star-outline" as IoniconName,
                  color: "#6B7280",
                  bg: "#F3F4F6",
                };
                return (
                  <View key={i} style={{
                    flexDirection: "row", alignItems: "center", gap: 14,
                    borderWidth: 1, borderColor: "#EBEBEB",
                    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 15,
                  }}>
                    <View style={{
                      width: 44, height: 44, borderRadius: 13,
                      backgroundColor: cfg.bg,
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}>
                      {b.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ── Localização ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 24, overflow: "hidden", ...SHADOW }}>
            <View style={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 14 }}>
              <Text style={{
                fontSize: 11, fontWeight: "800", color: "#9CA3AF",
                letterSpacing: 1.5, textTransform: "uppercase",
              }}>
                Localização
              </Text>
            </View>

            {/* Mapa decorativo */}
            <View style={{ height: 160, backgroundColor: "#0F172A", overflow: "hidden" }}>
              {/* linhas horizontais */}
              {[40, 80, 120].map((top) => (
                <View key={`h${top}`} style={{
                  position: "absolute", left: 0, right: 0, top,
                  height: 1, backgroundColor: "rgba(255,255,255,0.06)",
                }} />
              ))}
              {/* linhas verticais */}
              {["20%", "40%", "60%", "80%"].map((left) => (
                <View key={`v${left}`} style={{
                  position: "absolute", top: 0, bottom: 0,
                  // @ts-ignore
                  left,
                  width: 1, backgroundColor: "rgba(255,255,255,0.06)",
                }} />
              ))}
              {/* pin central */}
              <View style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                alignItems: "center", justifyContent: "center",
              }}>
                <View style={{
                  width: 54, height: 54, borderRadius: 27,
                  backgroundColor: "rgba(26,111,232,0.18)",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <View style={{
                    width: 38, height: 38, borderRadius: 19,
                    backgroundColor: "#1A6FE8",
                    alignItems: "center", justifyContent: "center",
                    shadowColor: "#1A6FE8", shadowOpacity: 0.55,
                    shadowRadius: 14, elevation: 6,
                  }}>
                    <Ionicons name="location" size={20} color="#fff" />
                  </View>
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: 22, paddingVertical: 18 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 20 }}>{job.address}</Text>
            </View>
          </View>

          {/* ── Sobre a empresa ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 22, ...SHADOW }}>
            <Text style={{
              fontSize: 11, fontWeight: "800", color: "#9CA3AF",
              letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16,
            }}>
              Sobre a Empresa
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 26, marginBottom: 18 }}>
              {highlightCompany(job.companyDescription, job.company)}
            </Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#1A6FE8" }}>
                Ver perfil completo
              </Text>
              <Ionicons name="open-outline" size={15} color="#1A6FE8" />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1, borderTopColor: "#F0F0F0",
        paddingHorizontal: 18, paddingTop: 16, paddingBottom: 34,
        flexDirection: "row", gap: 12,
      }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: saved ? "#1A6FE8" : "#D1D5DB",
            borderRadius: 16, paddingVertical: 15,
            alignItems: "center", justifyContent: "center",
            backgroundColor: saved ? "#EFF6FF" : "#fff",
            flexDirection: "row", gap: 7,
          }}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={17}
            color={saved ? "#1A6FE8" : "#6B7280"}
          />
          <Text style={{
            fontSize: 15, fontWeight: "700",
            color: saved ? "#1A6FE8" : "#374151",
          }}>
            Salvar Vaga
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            flex: 1.4,
            backgroundColor: "#1A6FE8", borderRadius: 16, paddingVertical: 15,
            alignItems: "center", justifyContent: "center",
            shadowColor: "#1A6FE8", shadowOpacity: 0.3,
            shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>Candidatar-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
