import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#1A6FE8" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1A6FE8" />

      {/* Formas decorativas de fundo */}
      <View
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: "rgba(255,255,255,0.07)",
          top: -90,
          right: -70,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: "rgba(255,255,255,0.06)",
          top: 60,
          left: -90,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "rgba(255,255,255,0.05)",
          bottom: 230,
          right: 20,
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Área da marca */}
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Text style={{
            color: "#fff",
            fontSize: 44,
            fontFamily: "PlusJakartaSans_800ExtraBold",
            letterSpacing: 0.5,
          }}>
            neway
          </Text>
          <Text style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
            letterSpacing: 0.4,
            fontFamily: "PlusJakartaSans_500Medium",
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
          paddingTop: 30,
          paddingBottom: 28,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: -8 },
          elevation: 10,
        }}>
          {/* Indicador de arraste */}
          <View style={{
            width: 40, height: 4, borderRadius: 2,
            backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 24,
          }} />

          <Text style={{ fontSize: 26, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#111827", marginBottom: 8, lineHeight: 32 }}>
            Bem-vindo ao{" "}
            <Text style={{ color: "#1A6FE8" }}>neway</Text>
          </Text>
          <Text style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 21, marginBottom: 28 }}>
            Encontre as melhores vagas de estágio e dê o próximo passo na sua carreira profissional.
          </Text>

          {/* Botão Entrar */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/login")}
            style={{
              backgroundColor: "#1A6FE8",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 12,
              shadowColor: "#1A6FE8",
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" }}>Entrar</Text>
          </TouchableOpacity>

          {/* Botão Criar conta */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/cadastro")}
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 16,
              paddingVertical: 15.5,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "#1A6FE8", fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" }}>Criar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: "center" }} activeOpacity={0.7}>
            <Text style={{ color: "#9CA3AF", fontSize: 13.5 }}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
