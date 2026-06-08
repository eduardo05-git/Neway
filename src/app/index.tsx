import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoMark } from "@/components/LogoMark";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1A6FE8" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1A6FE8" />

      {/* Área do logo */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }}>
        <LogoMark size={100} />
        <Text style={{
          color: "#fff",
          fontSize: 36,
          fontWeight: "800",
          letterSpacing: 1,
        }}>
          Neway
        </Text>
        <Text style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: 14,
          letterSpacing: 0.4,
          fontWeight: "500",
        }}>
          Sua carreira começa aqui
        </Text>
      </View>

      {/* Card inferior */}
      <View style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 28,
        paddingTop: 36,
        paddingBottom: 36,
      }}>
        {/* Indicador de arraste */}
        <View style={{
          width: 40, height: 4, borderRadius: 2,
          backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 28,
        }} />

        <Text style={{ fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 8 }}>
          Bem-vindo ao{" "}
          <Text style={{ color: "#1A6FE8" }}>Neway</Text>
        </Text>
        <Text style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 22, marginBottom: 32 }}>
          Encontre as melhores vagas de estágio e dê o próximo passo na sua carreira profissional.
        </Text>

        {/* Botão Entrar */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.replace("/(tabs)/jobs")}
          style={{
            backgroundColor: "#1A6FE8",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            marginBottom: 14,
            shadowColor: "#1A6FE8",
            shadowOpacity: 0.35,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Entrar</Text>
        </TouchableOpacity>

        {/* Botão Criar conta */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.replace("/(tabs)/jobs")}
          style={{
            borderWidth: 1.5,
            borderColor: "#1A6FE8",
            borderRadius: 16,
            paddingVertical: 15,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text style={{ color: "#1A6FE8", fontSize: 16, fontWeight: "700" }}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: "center" }} activeOpacity={0.7}>
          <Text style={{ color: "#9CA3AF", fontSize: 14 }}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
