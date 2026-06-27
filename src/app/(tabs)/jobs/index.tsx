import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getVagas, searchVagas, getAreaVisual, MODALIDADES, AREAS, type Vaga, type ModalidadeFiltro } from "@/services/vagaService";
import { logout } from "@/services/authService";

const FILTROS: ModalidadeFiltro[] = ["Todos", ...MODALIDADES];
type Ordenacao = "recentes" | "salario";
type FiltroArea = "Todas" | (typeof AREAS)[number];

function valorSalario(s: string | null): number | null {
  if (!s) return null;
  const limpo = s.replace(/[^\d,]/g, "").replace(",", ".");
  const valor = parseFloat(limpo);
  return isNaN(valor) ? null : valor;
}

function VagaCard({ vaga, onPress }: { vaga: Vaga; onPress: () => void }) {
  const local = [vaga.bairro, vaga.cidade].filter(Boolean).join(" - ");
  const visual = getAreaVisual(vaga.area);

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
      {/* Top row: logo + title */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 18 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 14,
            backgroundColor: visual.bg,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name={visual.icon as any} size={28} color={visual.color} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#111827", lineHeight: 25 }}>
            {vaga.nome}
          </Text>
          <Text style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>{vaga.empresaNome}</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {[vaga.area, vaga.modalidade].filter(Boolean).map((tag) => (
          <View
            key={tag as string}
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1 }}>
          <Ionicons name="location-outline" size={16} color="#9CA3AF" />
          <Text style={{ fontSize: 14, color: "#9CA3AF" }} numberOfLines={1}>
            {local || "Local a combinar"}
          </Text>
        </View>
        <Text style={{ fontSize: 15, color: "#1A6FE8", fontWeight: "700" }}>
          {vaga.salario || "A combinar"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function JobsScreen() {
  const router = useRouter();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [activeFiltro, setActiveFiltro] = useState<ModalidadeFiltro>("Todos");
  const [query, setQuery] = useState("");

  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtroArea, setFiltroArea] = useState<FiltroArea>("Todas");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");
  const [filtroAreaTemp, setFiltroAreaTemp] = useState<FiltroArea>("Todas");
  const [ordenacaoTemp, setOrdenacaoTemp] = useState<Ordenacao>("recentes");

  const loadVagas = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const data = query.trim() ? await searchVagas(query) : await getVagas(activeFiltro);
      setVagas(data);
    } catch {
      setErro("Não foi possível carregar as vagas. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  }, [activeFiltro, query]);

  useEffect(() => {
    loadVagas();
  }, [loadVagas]);

  const vagasExibidas = useMemo(() => {
    let lista = filtroArea === "Todas" ? vagas : vagas.filter((v) => v.area === filtroArea);
    lista = [...lista].sort((a, b) => {
      if (ordenacao === "salario") {
        const va = valorSalario(a.salario);
        const vb = valorSalario(b.salario);
        if (va === null && vb === null) return 0;
        if (va === null) return 1;
        if (vb === null) return -1;
        return vb - va;
      }
      return new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
    });
    return lista;
  }, [vagas, filtroArea, ordenacao]);

  function abrirFiltros() {
    setFiltroAreaTemp(filtroArea);
    setOrdenacaoTemp(ordenacao);
    setFiltrosAbertos(true);
  }

  function aplicarFiltros() {
    setFiltroArea(filtroAreaTemp);
    setOrdenacao(ordenacaoTemp);
    setFiltrosAbertos(false);
  }

  function limparFiltros() {
    setFiltroAreaTemp("Todas");
    setOrdenacaoTemp("recentes");
  }

  const filtrosAtivos = filtroArea !== "Todas" || ordenacao !== "recentes";

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
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>neway</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          <TouchableOpacity onPress={abrirFiltros} style={{ position: "relative" }}>
            <Ionicons name="options-outline" size={26} color="#374151" />
            {filtrosAtivos && (
              <View style={{
                position: "absolute", top: -2, right: -2,
                width: 9, height: 9, borderRadius: 5,
                backgroundColor: "#1A6FE8", borderWidth: 1.5, borderColor: "#F9FAFB",
              }} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => { await logout(); router.replace("/"); }}>
            <Ionicons name="log-out-outline" size={26} color="#374151" />
          </TouchableOpacity>
        </View>
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
            placeholder="Cargo, empresa ou área"
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
        {FILTROS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFiltro(f)}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 22,
              backgroundColor: activeFiltro === f ? "#1A6FE8" : "#fff",
              borderWidth: 1,
              borderColor: activeFiltro === f ? "#1A6FE8" : "#E5E7EB",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeFiltro === f ? "#fff" : "#6B7280",
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
      ) : erro ? (
        <View style={{ alignItems: "center", paddingVertical: 60, paddingHorizontal: 30 }}>
          <Ionicons name="cloud-offline-outline" size={48} color="#D1D5DB" />
          <Text style={{ color: "#9CA3AF", marginTop: 14, fontSize: 15, textAlign: "center" }}>{erro}</Text>
        </View>
      ) : (
        <FlatList
          data={vagasExibidas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <VagaCard vaga={item} onPress={() => router.push(`/(tabs)/jobs/${item.id}`)} />
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

      {/* ── Modal de Filtros ── */}
      <Modal visible={filtrosAbertos} animationType="slide" transparent onRequestClose={() => setFiltrosAbertos(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 34, maxHeight: "80%" }}>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <Text style={{ fontSize: 19, fontWeight: "800", color: "#111827" }}>Filtros</Text>
              <TouchableOpacity onPress={() => setFiltrosAbertos(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
              Ordenar por
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
              {([
                { valor: "recentes" as Ordenacao, label: "Mais recentes" },
                { valor: "salario" as Ordenacao, label: "Maior bolsa-auxílio" },
              ]).map((opt) => (
                <TouchableOpacity
                  key={opt.valor}
                  onPress={() => setOrdenacaoTemp(opt.valor)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center",
                    backgroundColor: ordenacaoTemp === opt.valor ? "#1A6FE8" : "#F3F4F6",
                  }}
                >
                  <Text style={{ fontSize: 13.5, fontWeight: "700", color: ordenacaoTemp === opt.valor ? "#fff" : "#374151" }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ fontSize: 13, fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
              Área
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
              {(["Todas", ...AREAS] as FiltroArea[]).map((a) => (
                <TouchableOpacity
                  key={a}
                  onPress={() => setFiltroAreaTemp(a)}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
                    backgroundColor: filtroAreaTemp === a ? "#1A6FE8" : "#fff",
                    borderWidth: 1, borderColor: filtroAreaTemp === a ? "#1A6FE8" : "#E5E7EB",
                  }}
                >
                  <Text style={{ fontSize: 13.5, fontWeight: "600", color: filtroAreaTemp === a ? "#fff" : "#6B7280" }}>
                    {a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={limparFiltros}
                style={{ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: "#F3F4F6" }}
              >
                <Text style={{ fontWeight: "700", color: "#374151" }}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={aplicarFiltros}
                style={{ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: "#1A6FE8" }}
              >
                <Text style={{ fontWeight: "700", color: "#fff" }}>Aplicar filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
