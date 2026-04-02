import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";

const DEMO_DOCUMENTS = [
  {
    id: "1",
    title: "Analysis Report: payment-service.ts",
    type: "TECHNICAL",
    preview: "Analysis identified 4 critical improvements with $1,240/month cost savings potential...",
    createdAt: "Mar 30, 2026",
  },
  {
    id: "2",
    title: "Analysis Report: database-queries.sql",
    type: "TECHNICAL",
    preview: "SQL optimization report: N+1 queries detected, missing indexes identified...",
    createdAt: "Mar 29, 2026",
  },
  {
    id: "3",
    title: "Implementation Guide: Redis Caching",
    type: "USER_GUIDE",
    preview: "Step-by-step guide for implementing Redis caching layer with connection pooling...",
    createdAt: "Mar 28, 2026",
  },
  {
    id: "4",
    title: "Architecture Review",
    type: "ARCHITECTURE",
    preview: "System architecture analysis highlighting bottlenecks and single points of failure...",
    createdAt: "Mar 27, 2026",
  },
];

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
  TECHNICAL: { bg: "#0c1a3d", text: "#60a5fa", icon: "💻" },
  USER_GUIDE: { bg: "#052e16", text: "#4ade80", icon: "📖" },
  ARCHITECTURE: { bg: "#2d1b69", text: "#a78bfa", icon: "🏗️" },
  API_REFERENCE: { bg: "#1a1a2e", text: "#c084fc", icon: "🔌" },
  CHANGELOG: { bg: "#1c1c1c", text: "#9ca3af", icon: "📋" },
};

export default function DocumentsScreen() {
  const [search, setSearch] = useState("");

  const filtered = DEMO_DOCUMENTS.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.preview.toLowerCase().includes(search.toLowerCase())
  );

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
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Documentation</Text>
        <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
          Auto-generated docs from your analyses
        </Text>
      </View>

      {/* Search */}
      <View style={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: "#13131f",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: "#1e1e3a",
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, color: "white", paddingVertical: 14, fontSize: 14 }}
            placeholder="Search documentation..."
            placeholderTextColor="#4b5563"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Documents */}
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {filtered.map((doc) => {
          const typeInfo = typeColors[doc.type] || typeColors.TECHNICAL;
          return (
            <TouchableOpacity
              key={doc.id}
              style={{
                backgroundColor: "#13131f",
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: "#1e1e3a",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: typeInfo.bg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{typeInfo.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>
                    {doc.title}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <View
                      style={{
                        backgroundColor: typeInfo.bg,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ color: typeInfo.text, fontSize: 10, fontWeight: "600" }}>
                        {doc.type.replace("_", " ")}
                      </Text>
                    </View>
                    <Text style={{ color: "#4b5563", fontSize: 11 }}>{doc.createdAt}</Text>
                  </View>
                </View>
              </View>
              <Text style={{ color: "#9ca3af", fontSize: 13, lineHeight: 18 }}>
                {doc.preview}
              </Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    alignItems: "center",
                    backgroundColor: "#1e1e3a",
                  }}
                >
                  <Text style={{ color: "#9ca3af", fontSize: 12, fontWeight: "600" }}>👁️ View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    alignItems: "center",
                    backgroundColor: "#1e1e3a",
                  }}
                >
                  <Text style={{ color: "#9ca3af", fontSize: 12, fontWeight: "600" }}>⬇️ Export</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
