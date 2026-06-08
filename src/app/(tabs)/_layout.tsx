import { Tabs, useRouter, usePathname } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { name: string; label: string; icon: IoniconName; iconActive: IoniconName }[] = [
  { name: "jobs", label: "Jobs", icon: "briefcase-outline", iconActive: "briefcase" },
  { name: "alerts", label: "Alerts", icon: "notifications-outline", iconActive: "notifications" },
  { name: "profile", label: "Profile", icon: "person-outline", iconActive: "person" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TabBar({ state }: any) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        paddingTop: 10,
        paddingBottom: 28,
        paddingHorizontal: 20,
      }}
    >
      {TABS.map((tab) => {
        const routeIndex = state.routes.findIndex(
          (r: { name: string }) => r.name === tab.name || r.name.startsWith(tab.name)
        );
        const isFocused = state.index === routeIndex || pathname.includes(`/${tab.name}`);

        return (
          <TouchableOpacity
            key={tab.name}
            style={{ flex: 1, alignItems: "center", gap: 4 }}
            activeOpacity={0.7}
            onPress={() => {
              if (!isFocused) router.navigate(`/(tabs)/${tab.name}` as never);
            }}
          >
            {isFocused ? (
              <View
                style={{
                  backgroundColor: "#1A6FE8",
                  borderRadius: 12,
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={tab.iconActive} size={22} color="#fff" />
              </View>
            ) : (
              <Ionicons name={tab.icon} size={22} color="#9CA3AF" />
            )}
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: isFocused ? "#1A6FE8" : "#9CA3AF",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="jobs" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
