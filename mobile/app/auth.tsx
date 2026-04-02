import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";

export default function AuthScreen() {
  const { setUser, setToken } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (!isLogin) {
        // Register
        await api.post("/api/auth/register", { name, email, password });
      }

      // Sign in via credentials
      const res = await api.post("/api/auth/callback/credentials", {
        email,
        password,
        redirect: false,
        csrfToken: "",
      });

      // Use a demo/test approach for mobile: get session via NEXTAUTH
      // In production, use a proper JWT endpoint
      const sessionRes = await api.get("/api/auth/session");

      if (sessionRes.data?.user) {
        setUser({
          id: sessionRes.data.user.id,
          name: sessionRes.data.user.name,
          email: sessionRes.data.user.email,
          image: sessionRes.data.user.image,
          plan: "",
        });
        setToken(sessionRes.data.user.id);
        router.replace("/(tabs)");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = () => {
    // Demo mode for testing
    setUser({
      id: "demo-user",
      name: "Demo User",
      email: "demo@rapid.dev",
      image: null,
      plan: "",
    });
    setToken("demo-token");
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#0a0a1a" }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#6172f4",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              shadowColor: "#6172f4",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 28, color: "white", fontWeight: "bold" }}>⚡</Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "white" }}>RAPID</Text>
          <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 4, textAlign: "center" }}>
            Read · Analyze · Patch · Implement · Document
          </Text>
        </View>

        {/* Card */}
        <View
          style={{
            backgroundColor: "#13131f",
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: "#1e1e3a",
          }}
        >
          {/* Toggle */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#0a0a1a",
              borderRadius: 10,
              padding: 4,
              marginBottom: 24,
            }}
          >
            {["Sign In", "Sign Up"].map((label, i) => (
              <TouchableOpacity
                key={label}
                onPress={() => { setIsLogin(i === 0); setError(""); }}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor: (i === 0) === isLogin ? "#6172f4" : "transparent",
                }}
              >
                <Text
                  style={{
                    color: (i === 0) === isLogin ? "white" : "#6b7280",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!isLogin && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>Full Name</Text>
              <TextInput
                style={{
                  backgroundColor: "#0a0a1a",
                  borderRadius: 10,
                  padding: 14,
                  color: "white",
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: "#1e1e3a",
                }}
                placeholder="John Doe"
                placeholderTextColor="#4b5563"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>Email</Text>
            <TextInput
              style={{
                backgroundColor: "#0a0a1a",
                borderRadius: 10,
                padding: 14,
                color: "white",
                fontSize: 15,
                borderWidth: 1,
                borderColor: "#1e1e3a",
              }}
              placeholder="you@company.com"
              placeholderTextColor="#4b5563"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>Password</Text>
            <TextInput
              style={{
                backgroundColor: "#0a0a1a",
                borderRadius: 10,
                padding: 14,
                color: "white",
                fontSize: 15,
                borderWidth: 1,
                borderColor: "#1e1e3a",
              }}
              placeholder="••••••••"
              placeholderTextColor="#4b5563"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? (
            <View
              style={{
                backgroundColor: "#3f1212",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#7f1d1d",
              }}
            >
              <Text style={{ color: "#f87171", fontSize: 13 }}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleAuth}
            disabled={loading}
            style={{
              backgroundColor: "#6172f4",
              borderRadius: 12,
              padding: 16,
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
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                {isLogin ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#1e1e3a" }} />
            <Text style={{ color: "#4b5563", marginHorizontal: 12, fontSize: 12 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#1e1e3a" }} />
          </View>

          <TouchableOpacity
            onPress={useDemoAccount}
            style={{
              backgroundColor: "transparent",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#1e1e3a",
            }}
          >
            <Text style={{ color: "#9ca3af", fontWeight: "600", fontSize: 14 }}>
              Try Demo Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
