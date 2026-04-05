import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";

const ANALYSIS_TYPES = [
  { id: "CODE", label: "Code", icon: "💻" },
  { id: "DATABASE", label: "Database", icon: "🗄️" },
  { id: "API", label: "API", icon: "🔗" },
  { id: "INFRASTRUCTURE", label: "Infra", icon: "☁️" },
  { id: "DASHBOARD", label: "Dashboard", icon: "📊" },
  { id: "GENERAL", label: "General", icon: "📝" },
];

const DEMO_RESULT = {
  findingsCount: 4,
  reliabilityScore: 72,
  performanceScore: 68,
  suggestions: [
    {
      title: "Replace SELECT * with specific columns",
      category: "COST_SAVING",
      priority: "HIGH",
      description: "Selecting only the required fields keeps the query easier to review and avoids unnecessary work.",
    },
    {
      title: "Add database connection pooling",
      category: "PERFORMANCE",
      priority: "HIGH",
      description: "Reuse connections consistently so request handling stays stable under heavier load.",
    },
    {
      title: "Implement Redis caching",
      category: "COST_SAVING",
      priority: "MEDIUM",
      description: "Cache frequently requested data to reduce repeated work and improve response time consistency.",
    },
    {
      title: "Add circuit breaker pattern",
      category: "RELIABILITY",
      priority: "HIGH",
      description: "Prevents cascade failures, improving system reliability by 40%.",
    },
  ],
};

export default function AnalyzeScreen() {
  const [type, setType] = useState("CODE");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof DEMO_RESULT | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim() || !title.trim()) {
      Alert.alert("Missing Fields", "Please provide a title and code to analyze.");
      return;
    }

    setLoading(true);
    // Simulate analysis
    await new Promise((r) => setTimeout(r, 2500));
    setResult(DEMO_RESULT);
    setLoading(false);
  };

  const priorityColors: Record<string, string> = {
    CRITICAL: "#ef4444",
    HIGH: "#f97316",
    MEDIUM: "#f59e0b",
    LOW: "#22c55e",
  };

  const categoryColors: Record<string, string> = {
    COST_SAVING: "#22c55e",
    PERFORMANCE: "#6172f4",
    RELIABILITY: "#f59e0b",
    SECURITY: "#ef4444",
  };
  const formatCategory = (category: string) =>
    (category === "COST_SAVING" ? "EFFICIENCY" : category).replace(/_/g, " ");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a1a" }}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
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
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Analyze</Text>
        <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
          Paste code or any text-based data to review findings quickly
        </Text>
      </View>

      <View style={{ padding: 16, gap: 16 }}>
        {/* Analysis Type */}
        <View>
          <Text style={{ color: "#9ca3af", fontSize: 13, fontWeight: "600", marginBottom: 10 }}>
            ANALYSIS TYPE
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {ANALYSIS_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setType(t.id)}
                  style={{
                    backgroundColor: type === t.id ? "#6172f420" : "#13131f",
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    borderWidth: 1,
                    borderColor: type === t.id ? "#6172f4" : "#1e1e3a",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{t.icon}</Text>
                  <Text
                    style={{
                      color: type === t.id ? "#8196fa" : "#9ca3af",
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Title */}
        <View>
          <Text style={{ color: "#9ca3af", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
            TITLE
          </Text>
          <TextInput
            style={{
              backgroundColor: "#13131f",
              borderRadius: 10,
              padding: 14,
              color: "white",
              fontSize: 15,
              borderWidth: 1,
              borderColor: "#1e1e3a",
            }}
            placeholder="e.g. customer-events review"
            placeholderTextColor="#4b5563"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Code Input */}
        <View>
          <Text style={{ color: "#9ca3af", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
            CODE / DATA
          </Text>
          <TextInput
            style={{
              backgroundColor: "#13131f",
              borderRadius: 10,
              padding: 14,
              color: "#d1fae5",
              fontSize: 12,
              fontFamily: "monospace",
              borderWidth: 1,
              borderColor: "#1e1e3a",
              minHeight: 200,
              textAlignVertical: "top",
            }}
            placeholder={`// Paste code or data here\nfunction getData() {\n  return db.query('SELECT * FROM users');\n}`}
            placeholderTextColor="#374151"
            multiline
            value={code}
            onChangeText={setCode}
          />
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={loading}
          style={{
            backgroundColor: "#6172f4",
            borderRadius: 14,
            padding: 18,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
            shadowColor: "#6172f4",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {loading ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <ActivityIndicator color="white" size="small" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Analyzing...</Text>
            </View>
          ) : (
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
              ⚡ Run Analysis
            </Text>
          )}
        </TouchableOpacity>

        {/* Results */}
        {result && (
          <View style={{ gap: 14 }}>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
              Analysis Results
            </Text>

            {/* Score Cards */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#052e16",
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#166534",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>💡</Text>
                <Text style={{ color: "#22c55e", fontSize: 20, fontWeight: "bold", marginTop: 4 }}>
                  {result.findingsCount}
                </Text>
                <Text style={{ color: "#4ade80", fontSize: 10, textAlign: "center" }}>Findings</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#0c1a3d",
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#1e40af",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>🛡️</Text>
                <Text style={{ color: "#60a5fa", fontSize: 20, fontWeight: "bold", marginTop: 4 }}>
                  {result.reliabilityScore}
                </Text>
                <Text style={{ color: "#93c5fd", fontSize: 10, textAlign: "center" }}>Reliability</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#2d1b69",
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#4c1d95",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>⚡</Text>
                <Text style={{ color: "#a78bfa", fontSize: 20, fontWeight: "bold", marginTop: 4 }}>
                  {result.performanceScore}
                </Text>
                <Text style={{ color: "#c4b5fd", fontSize: 10, textAlign: "center" }}>Performance</Text>
              </View>
            </View>

            {/* Findings */}
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
              {result.suggestions.length} Findings
            </Text>
            {result.suggestions.map((s, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: "#13131f",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#1e1e3a",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
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
                      backgroundColor: categoryColors[s.category] + "20",
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text style={{ color: categoryColors[s.category], fontSize: 10, fontWeight: "600" }}>
                      {s.category.replace("_", " ")}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: "white", fontWeight: "600", fontSize: 14, marginBottom: 4 }}>
                  {s.title}
                </Text>
                <Text style={{ color: "#9ca3af", fontSize: 12, lineHeight: 18 }}>
                  {s.description}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              style={{
                backgroundColor: "#13131f",
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#6172f4",
              }}
            >
              <Text style={{ color: "#8196fa", fontWeight: "700", fontSize: 14 }}>
                💡 Review Findings
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
