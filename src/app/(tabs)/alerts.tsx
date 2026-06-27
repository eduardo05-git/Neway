import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getNotifications, markAllAsRead, type Notification, type NotificationType } from "@/services/notificationsService";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const ICON_CONFIG: Record<NotificationType, { name: IoniconName; color: string; bg: string }> = {
  job_match:          { name: "briefcase-outline", color: "#1A6FE8", bg: "#DBEAFE" },
  application_viewed: { name: "eye-outline",        color: "#7C3AED", bg: "#EDE9FE" },
};

function NotificationCard({ item, onAction }: { item: Notification; onAction: (route: string) => void }) {
  const cfg = ICON_CONFIG[item.type];

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderLeftWidth: item.read ? 1 : 4,
        borderLeftColor: item.read ? "#E5E7EB" : "#1A6FE8",
        marginBottom: 14,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", padding: 20 }}>

        {/* Ícone */}
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 16,
            backgroundColor: cfg.bg,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
            flexShrink: 0,
          }}
        >
          <Ionicons name={cfg.name} size={28} color={cfg.color} />
        </View>

        {/* Conteúdo */}
        <View style={{ flex: 1 }}>

          {/* Título + tempo */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: "700",
                color: "#111827",
                lineHeight: 23,
                marginRight: 10,
              }}
            >
              {item.title}
            </Text>
            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3, flexShrink: 0 }}>
              {item.time}
            </Text>
          </View>

          {/* Descrição */}
          <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 21, marginBottom: item.actionLabel ? 14 : 0 }}>
            {item.description}
          </Text>

          {/* Botão de ação */}
          {item.actionLabel && item.actionRoute ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onAction(item.actionRoute!)}
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#1A6FE8",
                borderRadius: 12,
                paddingHorizontal: 22,
                paddingVertical: 11,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                {item.actionLabel}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

type FlatItem =
  | { type: "header"; title: string }
  | { type: "item"; item: Notification };

export default function AlertsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  function handleAction(route: string) {
    router.push(route as any);
  }

  const todayItems = notifications.filter((n) => n.group === "today");
  const yesterdayItems = notifications.filter((n) => n.group === "yesterday");
  const olderItems = notifications.filter((n) => n.group === "older");

  const flatData: FlatItem[] = [];
  if (todayItems.length > 0) {
    flatData.push({ type: "header", title: "HOJE" });
    todayItems.forEach((n) => flatData.push({ type: "item", item: n }));
  }
  if (yesterdayItems.length > 0) {
    flatData.push({ type: "header", title: "ONTEM" });
    yesterdayItems.forEach((n) => flatData.push({ type: "item", item: n }));
  }
  if (olderItems.length > 0) {
    flatData.push({ type: "header", title: "ANTERIORES" });
    olderItems.forEach((n) => flatData.push({ type: "item", item: n }));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          paddingBottom: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>neway</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={26} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Título + marcar lidas */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 22,
          paddingTop: 16,
          paddingBottom: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827" }}>Notificações</Text>
          {unreadCount > 0 && (
            <View
              style={{
                backgroundColor: "#1A6FE8",
                borderRadius: 20,
                paddingHorizontal: 9,
                paddingVertical: 3,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#1A6FE8" }}>
            Marcar lidas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subtítulo */}
      <Text style={{ fontSize: 13, color: "#9CA3AF", paddingHorizontal: 22, marginBottom: 20 }}>
        Você tem {unreadCount} {unreadCount === 1 ? "nova notificação" : "novas notificações"}
      </Text>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#1A6FE8" />
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item) =>
            item.type === "header" ? `h-${item.title}` : `n-${item.item.id}`
          }
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#9CA3AF",
                    letterSpacing: 1.2,
                    marginBottom: 12,
                    marginTop: 6,
                  }}
                >
                  {item.title}
                </Text>
              );
            }
            return <NotificationCard item={item.item} onAction={handleAction} />;
          }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Ionicons name="notifications-outline" size={56} color="#D1D5DB" />
              <Text style={{ color: "#9CA3AF", marginTop: 14, fontSize: 16 }}>
                Nenhuma notificação
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
