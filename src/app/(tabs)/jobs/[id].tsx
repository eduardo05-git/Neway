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
import { getJobById, toggleSaveJob } from "@/services/jobsService";
import type { Job } from "@/mocks/jobs";

const TYPE_COLOR: Record<string, string> = {
  Remoto: "bg-blue-100 text-blue-700",
  Híbrido: "bg-purple-100 text-purple-700",
  Presencial: "bg-orange-100 text-orange-700",
  "Tempo Integral": "bg-green-100 text-green-700",
};

const BENEFIT_ICONS: Record<string, string> = {
  heart: "❤️",
  "fork.knife": "🍴",
  house: "🏠",
  book: "📚",
  "figure.run": "🏃",
  car: "🚗",
  airplane: "✈️",
  gift: "🎁",
};

function formatSalary(min: number, max: number) {
  const fmt = (v: number) =>
    `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
  return `${fmt(min)} - ${fmt(max)}`;
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getJobById(id).then((data) => {
      if (data) {
        setJob(data);
        setSaved(data.isSaved);
      }
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
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#1A6FE8" />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Vaga não encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 bg-white rounded-xl items-center justify-center border border-gray-100"
        >
          <Text className="text-gray-700 text-base">←</Text>
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-brand rounded-lg items-center justify-center">
            <Text className="text-white text-sm font-bold">N</Text>
          </View>
          <Text className="text-gray-800 font-semibold">Neway</Text>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="w-9 h-9 bg-white rounded-xl items-center justify-center border border-gray-100"
        >
          <Text className="text-base">{saved ? "🔖" : "🏷️"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-5 pb-32">
          {/* Company logo & title */}
          <View className="bg-white rounded-2xl p-5 mb-4 items-start"
            style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <View className="w-16 h-16 bg-gray-800 rounded-2xl items-center justify-center mb-4">
              <Text className="text-3xl">🏢</Text>
            </View>

            <View className="flex-row flex-wrap gap-2 mb-3">
              <View className={`px-2 py-1 rounded-lg ${TYPE_COLOR[job.type] ?? "bg-gray-100"}`}>
                <Text className={`text-xs font-medium ${TYPE_COLOR[job.type]?.split(" ")[1] ?? "text-gray-600"}`}>
                  {job.type}
                </Text>
              </View>
              <View className={`px-2 py-1 rounded-lg ${TYPE_COLOR[job.regime] ?? "bg-gray-100"}`}>
                <Text className={`text-xs font-medium ${TYPE_COLOR[job.regime]?.split(" ")[1] ?? "text-gray-600"}`}>
                  {job.regime}
                </Text>
              </View>
            </View>

            <Text className="text-2xl font-bold text-gray-800 mb-1">{job.title}</Text>
            <Text className="text-brand font-semibold text-base mb-3">{job.company}</Text>

            <View className="flex-row items-center gap-4">
              <Text className="text-gray-400 text-sm">
                📍 {job.location}, {job.state} ({job.type})
              </Text>
            </View>
            <Text className="text-brand font-bold text-base mt-1">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </Text>
          </View>

          {/* Descrição */}
          <View className="bg-white rounded-2xl p-5 mb-4"
            style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <Text className="text-gray-800 font-bold text-base mb-3">📋 Descrição da Vaga</Text>
            <Text className="text-gray-500 text-sm leading-6">{job.description}</Text>
          </View>

          {/* Requisitos */}
          <View className="bg-white rounded-2xl p-5 mb-4"
            style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <Text className="text-gray-800 font-bold text-base mb-3">✅ Requisitos</Text>
            {job.requirements.map((req, i) => (
              <View key={i} className="flex-row gap-3 mb-3">
                <Text className="text-brand text-sm mt-0.5">✓</Text>
                <Text className="text-gray-500 text-sm leading-5 flex-1">{req}</Text>
              </View>
            ))}
          </View>

          {/* Benefícios */}
          <View className="bg-white rounded-2xl p-5 mb-4"
            style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <Text className="text-gray-800 font-bold text-base mb-3">🎁 Benefícios</Text>
            {job.benefits.map((b, i) => (
              <View key={i} className="flex-row items-center gap-3 mb-3">
                <View className="w-9 h-9 bg-brand-light rounded-xl items-center justify-center">
                  <Text className="text-base">{BENEFIT_ICONS[b.icon] ?? "⭐"}</Text>
                </View>
                <Text className="text-gray-700 text-sm font-medium">{b.label}</Text>
              </View>
            ))}
          </View>

          {/* Localização */}
          <View className="bg-white rounded-2xl overflow-hidden mb-4"
            style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <View className="p-4 pb-2">
              <Text className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Localização</Text>
            </View>
            <View className="h-36 bg-gray-200 items-center justify-center">
              <Text className="text-4xl">🗺️</Text>
            </View>
            <View className="p-4">
              <Text className="text-gray-500 text-xs">{job.address}</Text>
            </View>
          </View>

          {/* Sobre a empresa */}
          <View className="bg-white rounded-2xl p-5 mb-4"
            style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <Text className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-2">Sobre a Empresa</Text>
            <Text className="text-gray-500 text-sm leading-6 mb-3">{job.companyDescription}</Text>
            <TouchableOpacity>
              <Text className="text-brand text-sm font-semibold">Ver perfil completo ↗</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 flex-row gap-3"
        style={{ paddingBottom: 28 }}
      >
        <TouchableOpacity
          className="flex-1 border border-brand rounded-xl py-4 items-center"
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <Text className="text-brand font-semibold text-sm">Salvar Vaga</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-brand rounded-xl py-4 items-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-semibold text-sm">Candidatar-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
