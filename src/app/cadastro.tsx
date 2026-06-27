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
import { cadastrarAluno } from "@/services/authService";

function formatarDataDigitada(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  if (digitos.length > 4) return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
  if (digitos.length > 2) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return digitos;
}

function dataParaISO(dataBR: string): string | null {
  const [dia, mes, ano] = dataBR.split("/");
  if (!dia || !mes || !ano || ano.length !== 4) return null;
  return `${ano}-${mes}-${dia}`;
}

function Campo({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, color: "#374151", fontFamily: "PlusJakartaSans_600SemiBold", marginBottom: 8 }}>
        {label}
      </Text>
      <TextInput
        style={{
          borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 14,
          paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#111827",
        }}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}

export default function CadastroScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [rm, setRm] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [curso, setCurso] = useState("");
  const [conclusao, setConclusao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const regrasSenha = {
    minLength: senha.length >= 6,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    especial: /[^A-Za-z0-9]/.test(senha),
  };
  const senhaValida = Object.values(regrasSenha).every(Boolean);

  async function handleCadastro() {
    setErro("");

    if (!nome.trim() || !email.trim() || !rm.trim() || !curso.trim() || !conclusao.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (!senhaValida) {
      setErro("A senha não atende a todos os requisitos.");
      return;
    }
    const dataISO = dataParaISO(dataNascimento);
    if (!dataISO) {
      setErro("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
      return;
    }

    setLoading(true);
    try {
      await cadastrarAluno({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        rm: rm.trim(),
        curso: curso.trim(),
        conclusao: conclusao.trim(),
        dataNascimentoISO: dataISO,
      });
      router.replace("/login");
    } catch (err: any) {
      if (err?.message === "ERRO_ALUNO") {
        setErro("Conta criada, mas não foi possível salvar seus dados de aluno.");
      } else {
        setErro("Erro no cadastro. Verifique os dados ou se o e-mail já existe.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, marginBottom: 24 }}
          >
            <Ionicons name="arrow-back" size={18} color="#374151" />
            <Text style={{ color: "#374151", fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold" }}>
              Voltar
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 28, fontFamily: "PlusJakartaSans_800ExtraBold", color: "#111827", marginBottom: 6 }}>
            Crie sua conta
          </Text>
          <Text style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 28 }}>
            Seu futuro começa aqui
          </Text>

          {erro ? (
            <Text style={{ color: "#EF4444", fontSize: 13.5, marginBottom: 16, textAlign: "center" }}>
              {erro}
            </Text>
          ) : null}

          <Campo label="Nome completo" placeholder="Seu nome completo" value={nome} onChangeText={setNome} />
          <Campo label="E-mail" placeholder="email@exemplo.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Campo label="Senha" placeholder="Crie uma senha segura" secureTextEntry value={senha} onChangeText={setSenha} />

          {senha.length > 0 && (
            <View style={{ marginTop: -6, marginBottom: 16, gap: 4 }}>
              {[
                [regrasSenha.minLength, "Mínimo de 6 caracteres"],
                [regrasSenha.maiuscula, "Uma letra maiúscula"],
                [regrasSenha.minuscula, "Uma letra minúscula"],
                [regrasSenha.especial, "Um caractere especial (!@#$%...)"],
              ].map(([ok, texto], i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons
                    name={ok ? "checkmark-circle" : "ellipse-outline"}
                    size={14}
                    color={ok ? "#22C55E" : "#D1D5DB"}
                  />
                  <Text style={{ fontSize: 12.5, color: ok ? "#22C55E" : "#9CA3AF" }}>{texto as string}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Campo label="RM (matrícula)" placeholder="rm12345" value={rm} onChangeText={setRm} />
            </View>
            <View style={{ flex: 1 }}>
              <Campo
                label="Nascimento"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                value={dataNascimento}
                onChangeText={(v) => setDataNascimento(formatarDataDigitada(v))}
              />
            </View>
          </View>

          <Campo label="Curso" placeholder="Ex: Informática" value={curso} onChangeText={setCurso} />
          <Campo label="Previsão de conclusão" placeholder="Ex: DEZEMBRO/2026" value={conclusao} onChangeText={setConclusao} />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCadastro}
            disabled={loading}
            style={{
              backgroundColor: "#1A6FE8",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 10,
              marginBottom: 18,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" }}>
                Cadastrar
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")} style={{ alignItems: "center" }}>
            <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
              Já tem uma conta? <Text style={{ color: "#1A6FE8", fontFamily: "PlusJakartaSans_700Bold" }}>Entre aqui</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
