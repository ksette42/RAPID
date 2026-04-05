import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/store";

export default function IndexPage() {
  const { user } = useAuthStore();
  return <Redirect href={user ? "/(tabs)" : "/auth"} />;
}
