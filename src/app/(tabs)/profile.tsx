import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getUserProfile } from "@/services/userService";
import type { UserProfile, Application } from "@/mocks/user";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  "Em Análise":          { bg: "#1A6FE8", text: "#fff" },
  "Entrevista Marcada":  { bg: "#0891B2", text: "#fff" },
  "Processo Finalizado": { bg: "#F3F4F6", text: "#6B7280" },
  Aprovado:              { bg: "#16A34A", text: "#fff" },
  Reprovado:             { bg: "#EF4444", text: "#fff" },
};

const CARD_SHADOW = {
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
};

function ApplicationCard({ app }: { app: Application }) {
  const s = STATUS_CONFIG[app.status] ?? STATUS_CONFIG["Processo Finalizado"];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
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
      {/* Ícone */}
      <View style={{
        width: 56, height: 56, borderRadius: 16,
        backgroundColor: app.iconBg,
        alignItems: "center", justifyContent: "center",
        marginRight: 14, flexShrink: 0,
      }}>
        <Ionicons name={app.iconName as IoniconName} size={26} color={app.iconColor} />
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827" }}>{app.jobTitle}</Text>
        <Text style={{ fontSize: 13, color: "#1A6FE8", fontWeight: "600" }}>{app.company}</Text>
        <Text style={{ fontSize: 12, color: "#B0B7C3" }}>{app.appliedAt}</Text>
      </View>

      {/* Status + chevron */}
      <View style={{ alignItems: "flex-end", gap: 8, marginLeft: 8 }}>
        <View style={{
          backgroundColor: s.bg, borderRadius: 20,
          paddingHorizontal: 11, paddingVertical: 5,
        }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: s.text }}>• {app.status}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1A6FE8" />
      </SafeAreaView>
    );
  }

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 22, paddingTop: 10, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: "#F0F0F0", backgroundColor: "#F9FAFB",
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image source={{ uri: user.avatarUrl }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          <Text style={{ fontSize: 19, fontWeight: "700", color: "#111827" }}>Neway</Text>
        </View>
        <TouchableOpacity style={{ padding: 4 }}>
          <Ionicons name="options-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

        {/* ── SEÇÃO 1: Perfil hero ── */}
        <View style={{
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: 52,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}>
          {/* Foto com anel */}
          <View style={{
            padding: 4, borderRadius: 28, borderWidth: 2,
            borderColor: "#1A6FE8", marginBottom: 20,
          }}>
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: 116, height: 116, borderRadius: 22 }}
            />
          </View>

          <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827", marginBottom: 6, textAlign: "center" }}>
            {user.name}
          </Text>
          <Text style={{ fontSize: 14, color: "#1A6FE8", fontWeight: "600", marginBottom: 18, textAlign: "center", lineHeight: 20 }}>
            {user.title}
          </Text>

          {/* Localização e email */}
          <View style={{ gap: 8, alignItems: "center", marginBottom: 32 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="location-outline" size={15} color="#9CA3AF" />
              <Text style={{ fontSize: 13, color: "#9CA3AF" }}>{user.location}, {user.state}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="mail-outline" size={15} color="#9CA3AF" />
              <Text style={{ fontSize: 13, color: "#9CA3AF" }}>{user.email}</Text>
            </View>
          </View>

          {/* Botão */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              backgroundColor: "#1A6FE8",
              borderRadius: 16,
              paddingHorizontal: 56,
              paddingVertical: 15,
              ...CARD_SHADOW,
              shadowColor: "#1A6FE8",
              shadowOpacity: 0.35,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.3 }}>
              Editar Perfil
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 14 }}>

          {/* ── SEÇÃO 2: Bio ── */}
          <View style={{
            backgroundColor: "#fff", borderRadius: 22,
            borderWidth: 1, borderColor: "#F0F0F0",
            padding: 22, ...CARD_SHADOW,
          }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 12 }}>Bio</Text>
            <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 24 }}>
              Especialista em criar{" "}
              <Text style={{ color: "#1A6FE8", fontWeight: "600" }}>
                experiências digitais centradas no humano
              </Text>{" "}
              com mais de 8 anos de mercado.{" "}
              <Text style={{ color: "#1A6FE8", fontWeight: "600" }}>
                Focada em soluções SaaS
              </Text>{" "}
              e ecossistemas complexos de{" "}
              <Text style={{ color: "#1A6FE8", fontWeight: "600" }}>design system.</Text>{" "}
              Atualmente buscando novos desafios em empresas tech de alto crescimento.
            </Text>
          </View>

          {/* ── SEÇÃO 3: Vagas Salvas ── */}
          <View style={{
            backgroundColor: "#0F172A", borderRadius: 22,
            paddingVertical: 44, alignItems: "center",
            ...CARD_SHADOW, shadowOpacity: 0.18,
          }}>
            <Text style={{ fontSize: 60, fontWeight: "900", color: "#fff", lineHeight: 68 }}>
              {user.savedJobsCount}
            </Text>
            <Text style={{ fontSize: 14, color: "#64748B", marginTop: 6, letterSpacing: 0.5, fontWeight: "500" }}>
              Vagas Salvas
            </Text>
          </View>

          {/* ── SEÇÃO 4: Candidaturas ── */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2, paddingTop: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>Minhas Candidaturas</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 14, color: "#1A6FE8", fontWeight: "600" }}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {user.applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}

          {/* ── SEÇÃO 5: Banner currículo ── */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={{
              backgroundColor: "#0F172A", borderRadius: 22,
              padding: 24, marginTop: 4,
              flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              ...CARD_SHADOW, shadowOpacity: 0.18,
            }}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff", marginBottom: 6 }}>
                Melhore seu Currículo
              </Text>
              <Text style={{ fontSize: 13, color: "#64748B", lineHeight: 20 }}>
                Receba feedback especializado de profissionais de RH.
              </Text>
            </View>
            <View style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
            }}>
              <Ionicons name="arrow-forward" size={20} color="#0F172A" />
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
