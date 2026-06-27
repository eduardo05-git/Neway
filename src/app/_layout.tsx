import "../global.css";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

SplashScreen.preventAutoHideAsync();

// Define a fonte padrão do app pra todo Text/TextInput, sem precisar tocar em cada tela.
// @ts-expect-error defaultProps não é tipado, mas funciona em runtime
Text.defaultProps = Text.defaultProps || {};
// @ts-expect-error
Text.defaultProps.style = [{ fontFamily: "PlusJakartaSans_400Regular" }, Text.defaultProps.style];
// @ts-expect-error
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-expect-error
TextInput.defaultProps.style = [{ fontFamily: "PlusJakartaSans_400Regular" }, TextInput.defaultProps.style];

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
