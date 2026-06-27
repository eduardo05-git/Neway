import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { login } from "@/services/authService";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin() {
    setErro("");
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), senha);
      router.replace("/(tabs)/jobs");
    } catch (err: any) {
      if (err?.message === "NAO_ESTUDANTE") {
        setErro("Este app é exclusivo para estudantes.");
      } else if (err?.message === "CREDENCIAIS_INVALIDAS") {
        setErro("E-mail ou senha incorretos.");
      } else {
        setErro("Não foi possível conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28 }} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, marginBottom: 28 }}
          >
            <Ionicons name="arrow-back" size={18} color="#374151" />
            <Text style={{ color: "#374151", fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold" }}>
              Voltar
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 28, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#111827", marginBottom: 6 }}>
            Bem-vindo de volta
          </Text>
          <Text style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 32 }}>
            Acesse sua conta para encontrar oportunidades
          </Text>

          {erro ? (
            <Text style={{ color: "#EF4444", fontSize: 13.5, marginBottom: 16, textAlign: "center" }}>
              {erro}
            </Text>
          ) : null}

          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 13, color: "#374151", fontFamily: "PlusJakartaSans_600SemiBold", marginBottom: 8 }}>
              E-mail
            </Text>
            <TextInput
              style={{
                borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 14,
                paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#111827",
              }}
              placeholder="email@exemplo.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={{ marginBottom: 28 }}>
            <Text style={{ fontSize: 13, color: "#374151", fontFamily: "PlusJakartaSans_600SemiBold", marginBottom: 8 }}>
              Senha
            </Text>
            <TextInput
              style={{
                borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 14,
                paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#111827",
              }}
              placeholder="Sua senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: "#1A6FE8",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 18,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" }}>
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/cadastro")} style={{ alignItems: "center" }}>
            <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
              Não tem uma conta? <Text style={{ color: "#1A6FE8", fontFamily: "PlusJakartaSans_700Bold" }}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
