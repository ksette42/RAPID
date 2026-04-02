import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";

const DEMO_STATS = {
  totalAnalyses: 12,
  pendingSuggestions: 5,
  implementedChanges: 8,
  costSavings: 2340,
};

const DEMO_ANALYSES = [
  {
    id: "1",
    title: "payment-service.ts",
    language: "TypeScript",
    status: "COMPLETED",
    costSavings: 450,
    createdAt: "2026-03-30",
  },
  {
    id: "2",
    title: "database-queries.sql",
    language: "SQL",
    status: "COMPLETED",
    costSavings: 890,
    createdAt: "2026-03-29",
  },
  {
    id: "3",
    title: "auth-middleware.go",
    language: "Go",
    status: "PROCESSING",
    costSavings: 0,
    createdAt: "2026-03-31",
  },
];

function StatCard({ label, value, color, icon }: any) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#13131f",
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "#1e1e3a",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", color, marginTop: 4 }}>{value}</Text>
      <Text style={{ fontSize: 10, color: "#6b7280", textAlign: "center", marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function AnalysisRow({ analysis }: any) {
  const statusColors: Record<string, string> = {
    COMPLETED: "#22c55e",
    PROCESSING: "#6172f4",
    PENDING: "#f59e0b",
    FAILED: "#ef4444",
  };

  return (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#1e1e3a",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: "#6172f420",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ fontSize: 18 }}>⚡</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>{analysis.title}</Text>
        <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
          {analysis.language} · {analysis.createdAt}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        {analysis.costSavings > 0 && (
          <Text style={{ color: "#22c55e", fontSize: 12, fontWeight: "600" }}>
            -${analysis.costSavings}/mo
          </Text>
        )}
        <View
          style={{
            backgroundColor: statusColors[analysis.status] + "20",
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 2,
            marginTop: 4,
            borderWidth: 1,
            borderColor: statusColors[analysis.status] + "40",
          }}
        >
          <Text style={{ color: statusColors[analysis.status], fontSize: 10, fontWeight: "600" }}>
            {analysis.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a1a" }}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6172f4" />
      }
    >
      {/* Header */}
      <View
        style={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 20,
          backgroundColor: "#13131f",
          borderBottomWidth: 1,
          borderBottomColor: "#1e1e3a",
        }}
      >
        <Text style={{ color: "#6b7280", fontSize: 14 }}>Welcome back,</Text>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", marginTop: 2 }}>
          {user?.name?.split(" ")[0] ?? "there"} 👋
        </Text>
        <View
          style={{
            backgroundColor: "#6172f420",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
            marginTop: 8,
            alignSelf: "flex-start",
            borderWidth: 1,
            borderColor: "#6172f440",
          }}
        >
          <Text style={{ color: "#8196fa", fontSize: 12, fontWeight: "600" }}>
            {user?.plan ?? "FREE"} PLAN
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={{ padding: 16 }}>
        <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
          Your Impact
        </Text>
        <View style={{ flexDirection: "row", marginHorizontal: -4 }}>
          <StatCard label="Analyses" value={DEMO_STATS.totalAnalyses} color="#6172f4" icon="⚡" />
          <StatCard label="Suggestions" value={DEMO_STATS.pendingSuggestions} color="#f59e0b" icon="💡" />
          <StatCard label="Savings/mo" value={`$${DEMO_STATS.costSavings}`} color="#22c55e" icon="📉" />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
          Quick Actions
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/analyze")}
            style={{
              flex: 1,
              backgroundColor: "#6172f4",
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              shadowColor: "#6172f4",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 4 }}>⚡</Text>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>New Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/suggestions")}
            style={{
              flex: 1,
              backgroundColor: "#13131f",
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#1e1e3a",
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 4 }}>💡</Text>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>Suggestions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Analyses */}
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Recent Analyses</Text>
          <TouchableOpacity>
            <Text style={{ color: "#6172f4", fontSize: 13 }}>View all →</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "#13131f",
            borderRadius: 14,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: "#1e1e3a",
          }}
        >
          {DEMO_ANALYSES.map((a) => (
            <AnalysisRow key={a.id} analysis={a} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
