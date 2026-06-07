import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-brand">
      <StatusBar barStyle="light-content" backgroundColor="#1A6FE8" />

      {/* Logo */}
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 bg-white/20 rounded-3xl items-center justify-center mb-6">
          <Text className="text-5xl">💼</Text>
        </View>
        <Text className="text-white text-4xl font-bold tracking-tight">Neway</Text>
      </View>

      {/* Bottom card */}
      <View className="bg-white rounded-t-3xl px-8 pt-10 pb-10">
        <Text className="text-3xl font-bold text-gray-800 mb-3">
          Bem-vindo ao{" "}
          <Text className="text-brand">Neway</Text>
        </Text>
        <Text className="text-gray-500 text-base leading-6 mb-10">
          Sua jornada profissional começa aqui. Encontre as melhores vagas de
          estágio e dê o próximo passo na sua carreira.
        </Text>

        <TouchableOpacity
          className="bg-brand rounded-xl py-4 items-center mb-4"
          activeOpacity={0.85}
          onPress={() => router.replace("/(tabs)/jobs")}
        >
          <Text className="text-white text-base font-semibold">Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-brand rounded-xl py-4 items-center mb-6"
          activeOpacity={0.85}
          onPress={() => router.replace("/(tabs)/jobs")}
        >
          <Text className="text-brand text-base font-semibold">Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" activeOpacity={0.7}>
          <Text className="text-gray-400 text-sm">Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
