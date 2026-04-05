import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";

const formatCategory = (category: string) =>
  (category === "COST_SAVING" ? "EFFICIENCY" : category).replace(/_/g, " ");

const DEMO_SUGGESTIONS = [
  {
    id: "1",
    title: "Replace SELECT * with specific columns",
    description: "Select only the fields you need to keep the query easier to review and process.",
    category: "COST_SAVING",
    priority: "HIGH",
    status: "PENDING",
    analysisTitle: "payment-service.ts",
  },
  {
    id: "2",
    title: "Add database connection pooling",
    description: "Reuse database connections to stabilize response times under heavier load.",
    category: "PERFORMANCE",
    priority: "HIGH",
    status: "PENDING",
    analysisTitle: "payment-service.ts",
  },
  {
    id: "3",
    title: "Document expected request inputs",
    description: "Add a short note describing required fields and edge cases before this module grows further.",
    category: "MAINTAINABILITY",
    priority: "MEDIUM",
    status: "APPROVED",
    analysisTitle: "database-queries.sql",
  },
  {
    id: "4",
    title: "Add circuit breaker pattern",
    description: "Protect downstream calls so one unstable dependency does not cascade across the rest of the flow.",
    category: "RELIABILITY",
    priority: "HIGH",
    status: "IMPLEMENTED",
    analysisTitle: "auth-middleware.go",
  },
  {
    id: "5",
    title: "Group repeated array transforms",
    description: "Consolidate repeated data passes into one clearer transformation to improve readability.",
    category: "MAINTAINABILITY",
    priority: "LOW",
    status: "PENDING",
    analysisTitle: "payment-service.ts",
  },
];

export default function SuggestionsScreen() {
  const [suggestions, setSuggestions] = useState(DEMO_SUGGESTIONS);
  const [activeTab, setActiveTab] = useState("PENDING");

  const pending = suggestions.filter((s) => s.status === "PENDING");
  const approved = suggestions.filter((s) => s.status === "APPROVED");
  const implemented = suggestions.filter((s) => s.status === "IMPLEMENTED");

  const handleApprove = (id: string) => {
    Alert.alert(
      "Approve Finding",
      "This will queue the change for implementation. You can still review and apply it manually.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            setSuggestions((prev) =>
              prev.map((s) => (s.id === id ? { ...s, status: "APPROVED" } : s))
            );
          },
        },
      ]
    );
  };

  const handleDismiss = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const tabs = [
    { id: "PENDING", label: `Pending (${pending.length})` },
    { id: "APPROVED", label: `Approved (${approved.length})` },
    { id: "IMPLEMENTED", label: `Done (${implemented.length})` },
  ];

  const filteredSuggestions = suggestions.filter((s) => s.status === activeTab);

  const priorityColors: Record<string, string> = {
    CRITICAL: "#ef4444",
    HIGH: "#f97316",
    MEDIUM: "#f59e0b",
    LOW: "#22c55e",
  };

  const categoryIcons: Record<string, string> = {
    COST_SAVING: "📉",
    PERFORMANCE: "⚡",
    RELIABILITY: "🛡️",
    SECURITY: "🔒",
    MAINTAINABILITY: "🔧",
    SCALABILITY: "📈",
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
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Findings</Text>
        <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
          Review and approve AI-generated findings
        </Text>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", padding: 16, gap: 8 }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: "center",
              backgroundColor: activeTab === tab.id ? "#6172f420" : "#13131f",
              borderWidth: 1,
              borderColor: activeTab === tab.id ? "#6172f4" : "#1e1e3a",
            }}
          >
            <Text
              style={{
                color: activeTab === tab.id ? "#8196fa" : "#6b7280",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Findings list */}
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {filteredSuggestions.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>💡</Text>
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              No findings here
            </Text>
            <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 4, textAlign: "center" }}>
              Run an analysis to generate findings
            </Text>
          </View>
        ) : (
          filteredSuggestions.map((s) => (
            <View
              key={s.id}
              style={{
                backgroundColor: "#13131f",
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: "#1e1e3a",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 24 }}>{categoryIcons[s.category] || "💡"}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>
                    {s.title}
                  </Text>
                  <Text style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>
                    {s.analysisTitle}
                  </Text>
                </View>
              </View>

              <Text style={{ color: "#9ca3af", fontSize: 13, lineHeight: 18, marginBottom: 12 }}>
                {s.description}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: priorityColors[s.priority] + "20",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderWidth: 1,
                    borderColor: priorityColors[s.priority] + "40",
                  }}
                >
                  <Text style={{ color: priorityColors[s.priority], fontSize: 10, fontWeight: "700" }}>
                    {s.priority}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#1e1e3a",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ color: "#9ca3af", fontSize: 10 }}>
                    {formatCategory(s.category)}
                  </Text>
                </View>
              </View>

              {s.status === "PENDING" && (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => handleDismiss(s.id)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 10,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#ef444440",
                      backgroundColor: "#ef444410",
                    }}
                  >
                    <Text style={{ color: "#f87171", fontWeight: "600", fontSize: 13 }}>Dismiss</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleApprove(s.id)}
                    style={{
                      flex: 2,
                      padding: 12,
                      borderRadius: 10,
                      alignItems: "center",
                      backgroundColor: "#6172f4",
                      shadowColor: "#6172f4",
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.3,
                      shadowRadius: 6,
                      elevation: 3,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>
                      ✓ Approve
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {s.status === "APPROVED" && (
                <View
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: "#0c1a3d",
                    borderWidth: 1,
                    borderColor: "#1e40af",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>✓</Text>
                  <Text style={{ color: "#60a5fa", fontSize: 13 }}>
                    Approved — ready to implement
                  </Text>
                </View>
              )}

              {s.status === "IMPLEMENTED" && (
                <View
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: "#052e16",
                    borderWidth: 1,
                    borderColor: "#166534",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>✅</Text>
                  <Text style={{ color: "#4ade80", fontSize: 13 }}>
                    Successfully implemented
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
