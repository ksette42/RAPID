import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/lib/store";

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [analysisAlerts, setAnalysisAlerts] = useState(true);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/auth");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a1a" }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View
        style={{
          padding: 24,
          paddingTop: 56,
          backgroundColor: "#13131f",
          borderBottomWidth: 1,
          borderBottomColor: "#1e1e3a",
        }}
      >
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Settings</Text>
      </View>

      {/* Profile */}
      <View style={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: "#13131f",
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1e1e3a",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#6172f4",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
              {user?.name ?? "User"}
            </Text>
            <Text style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
              {user?.email ?? ""}
            </Text>
            <Text style={{ color: "#9ca3af", fontSize: 11, marginTop: 6 }}>
              Update your profile and review app preferences.
            </Text>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "600", marginBottom: 10, paddingHorizontal: 4 }}>
          NOTIFICATIONS
        </Text>
        <View
          style={{
            backgroundColor: "#13131f",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#1e1e3a",
          }}
        >
          {[
            { label: "Push Notifications", desc: "All app notifications", state: notifications, set: setNotifications },
            { label: "Analysis Alerts", desc: "When analysis completes", state: analysisAlerts, set: setAnalysisAlerts },
            { label: "Findings Ready", desc: "When new findings are ready to review", state: analysisAlerts, set: setAnalysisAlerts },
          ].map((item, i) => (
            <View
              key={item.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: i < 2 ? 1 : 0,
                borderBottomColor: "#1e1e3a",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>{item.label}</Text>
                <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{item.desc}</Text>
              </View>
              <Switch
                value={item.state}
                onValueChange={item.set}
                trackColor={{ false: "#1e1e3a", true: "#6172f4" }}
                thumbColor="white"
              />
            </View>
          ))}
        </View>
      </View>

      {/* About */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "600", marginBottom: 10, paddingHorizontal: 4 }}>
          ABOUT
        </Text>
        <View
          style={{
            backgroundColor: "#13131f",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#1e1e3a",
          }}
        >
          {[
            { label: "Privacy Policy", icon: "🔒" },
            { label: "Terms of Service", icon: "📄" },
            { label: "Support", icon: "💬" },
            { label: "App Version", icon: "ℹ️", value: "1.0.0" },
          ].map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: i < 3 ? 1 : 0,
                borderBottomColor: "#1e1e3a",
              }}
            >
              <Text style={{ fontSize: 16, marginRight: 12 }}>{item.icon}</Text>
              <Text style={{ color: "white", fontSize: 14, flex: 1 }}>{item.label}</Text>
              {item.value ? (
                <Text style={{ color: "#6b7280", fontSize: 13 }}>{item.value}</Text>
              ) : (
                <Text style={{ color: "#4b5563", fontSize: 16 }}>→</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Danger */}
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "#3f1212",
            borderRadius: 14,
            padding: 16,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#7f1d1d",
          }}
        >
          <Text style={{ color: "#f87171", fontWeight: "700", fontSize: 15 }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
