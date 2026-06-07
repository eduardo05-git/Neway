import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getJobs, searchJobs, toggleSaveJob, type FilterType } from "@/services/jobsService";
import type { Job } from "@/mocks/jobs";

const FILTERS: FilterType[] = ["Todos", "Remoto", "Tempo Integral"];

function formatSalary(min: number, max: number) {
  const fmt = (v: number) =>
    `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
  return `${fmt(min)} - ${fmt(max)}`;
}

function JobCard({
  job,
  onPress,
  onSave,
}: {
  job: Job;
  onPress: () => void;
  onSave: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      {/* Top row: logo + title + bookmark */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 18 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 14,
            backgroundColor: "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name="business-outline" size={30} color="#6B7280" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#111827", lineHeight: 25 }}>
            {job.title}
          </Text>
          <Text style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>{job.company}</Text>
        </View>

        <TouchableOpacity onPress={onSave} activeOpacity={0.7} style={{ padding: 4 }}>
          <Ionicons
            name={job.isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color={job.isSaved ? "#1A6FE8" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>

      {/* Tags */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {[job.type, job.regime, job.level].map((tag) => (
          <View
            key={tag}
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 7,
            }}
          >
            <Text style={{ fontSize: 13, color: "#6B7280", fontWeight: "500" }}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "#F3F4F6", marginBottom: 16 }} />

      {/* Location + Salary */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="location-outline" size={16} color="#9CA3AF" />
          <Text style={{ fontSize: 14, color: "#9CA3AF" }}>
            {job.location}, {job.state}
          </Text>
        </View>
        <Text style={{ fontSize: 15, color: "#1A6FE8", fontWeight: "700" }}>
          {formatSalary(job.salaryMin, job.salaryMax)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function JobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("Todos");
  const [query, setQuery] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const data = query.trim() ? await searchJobs(query) : await getJobs(activeFilter);
    setJobs(data);
    setLoading(false);
  }, [activeFilter, query]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSave = async (id: string) => {
    await toggleSaveJob(id);
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, isSaved: !j.isSaved } : j)));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 22,
          paddingTop: 10,
          paddingBottom: 18,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={{ width: 42, height: 42, borderRadius: 21 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>Neway</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={26} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 22, marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Ionicons name="search-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 15, color: "#374151" }}
            placeholder="Cargo, empresa ou palavra-chave"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={{ flexDirection: "row", paddingHorizontal: 22, gap: 10, marginBottom: 20 }}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 22,
              backgroundColor: activeFilter === f ? "#1A6FE8" : "#fff",
              borderWidth: 1,
              borderColor: activeFilter === f ? "#1A6FE8" : "#E5E7EB",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeFilter === f ? "#fff" : "#6B7280",
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section label */}
      <View style={{ paddingHorizontal: 22, marginBottom: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#1A6FE8" }}>
          Vagas em Destaque
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#1A6FE8" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push(`/(tabs)/jobs/${item.id}`)}
              onSave={() => handleSave(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={{ color: "#9CA3AF", marginTop: 14, fontSize: 16 }}>
                Nenhuma vaga encontrada
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
